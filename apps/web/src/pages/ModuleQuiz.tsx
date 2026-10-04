import React, { useState } from 'react';
import AppShell from '../components/Layout/AppShell';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { QuizQuestionOut, QuizResultOut, CourseDetailOut } from '../types/course';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import BreadcrumbNav from '../components/Course/BreadcrumbNav';

export default function ModuleQuiz() {
  const { slug, moduleNum } = useParams<{ slug: string, moduleNum: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultOut | null>(null);

  const { data: course } = useQuery<CourseDetailOut>({
    queryKey: ['course', slug],
    queryFn: () => api.get(`/courses/${slug}`).then(r => r.data),
    enabled: !!slug
  });

  const { data: questions, isLoading } = useQuery<QuizQuestionOut[]>({
    queryKey: ['quiz', slug, moduleNum],
    queryFn: () => api.get(`/courses/${slug}/modules/${moduleNum}/quiz`).then(r => r.data),
    enabled: !!slug && !!moduleNum
  });

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, string>) => 
      api.post(`/courses/${slug}/modules/${moduleNum}/quiz`, { answers: data }).then(r => r.data),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['course', slug] });
      queryClient.invalidateQueries({ queryKey: ['course-progress', slug] });
    }
  });

  const moduleInfo = course?.modules.find(m => m.module_number === Number(moduleNum));

  if (isLoading || !questions) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AppShell>
    );
  }

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      submitMutation.mutate(answers);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setResult(null);
  };

  if (result) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: course?.title || 'Course', href: `/courses/${slug}` },
              { label: moduleInfo?.title || 'Module', href: undefined },
              { label: 'Quiz Results' }
            ]} />
            <button
              onClick={() => navigate(`/courses/${slug}`)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
            >
              ← Back to Course
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className={`p-8 text-center border-b ${result.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {result.passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
              </h2>
              <p className="text-slate-600 mb-6">
                You scored <span className="font-bold text-slate-900">{result.score}</span> out of {result.total_points} ({Math.round(result.percentage)}%)
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!result.passed && (
                  <button 
                    onClick={handleRetry}
                    className="px-6 py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={18} /> Retry Quiz
                  </button>
                )}
                <button 
                  onClick={() => navigate(`/courses/${slug}`)}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  Back to Course
                </button>
                {result.passed && moduleInfo && moduleInfo.module_number < (course?.num_modules || 0) && (
                  <button 
                    onClick={() => {
                      const nextModule = course?.modules.find(m => m.module_number === moduleInfo.module_number + 1);
                      if (nextModule && nextModule.lessons.length > 0) {
                        navigate(`/courses/${slug}/lessons/${nextModule.lessons[0].id}`);
                      } else {
                        navigate(`/courses/${slug}`);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Next Module <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-8 space-y-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Results</h3>
              {result.question_results.map((qr, idx) => {
                const question = questions.find(q => q.id === qr.question_id);
                if (!question) return null;
                
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="mt-1">
                        {qr.correct ? (
                          <CheckCircle2 className="text-emerald-500" size={24} />
                        ) : (
                          <XCircle className="text-rose-500" size={24} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-500 mb-1">Question {idx + 1}</div>
                        <p className="text-lg font-medium text-slate-900">{question.question}</p>
                      </div>
                    </div>

                    <div className="ml-10 space-y-3">
                      <div className="text-sm">
                        <span className="text-slate-500">Your answer: </span>
                        <span className={`font-medium ${qr.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {answers[qr.question_id] || 'Skipped'}
                        </span>
                      </div>
                      
                      {!qr.correct && (
                        <div className="text-sm">
                          <span className="text-slate-500">Correct answer: </span>
                          <span className="font-medium text-emerald-700">{qr.correct_answer}</span>
                        </div>
                      )}

                      {qr.explanation && (
                        <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-xl">💡</span>
                          <p>{qr.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const question = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;
  const currentAnswer = answers[question.id];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <BreadcrumbNav items={[
            { label: 'Home', href: '/' },
            { label: course?.title || 'Course', href: `/courses/${slug}` },
            { label: moduleInfo?.title || 'Module', href: undefined },
            { label: 'Quiz' }
          ]} />
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
          >
            ← Back to Course
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-2">
            <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIdx) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(question.id, option)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    currentAnswer === option
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    currentAnswer === option
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-300'
                  }`}>
                    {currentAnswer === option && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-medium text-lg">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!currentAnswer || submitMutation.isPending}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                !currentAnswer
                  ? 'bg-slate-300 cursor-not-allowed'
                  : submitMutation.isPending
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {submitMutation.isPending ? 'Submitting...' : isLastQuestion ? 'Submit Quiz' : 'Next Question'} 
              {!isLastQuestion && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
