import React from 'react';
import AppShell from '../components/Layout/AppShell';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { CourseOut } from '../types/course';
import { GraduationCap, CheckCircle, Share2, ArrowRight, Award } from 'lucide-react';
import BreadcrumbNav from '../components/Course/BreadcrumbNav';
import { generateAndDownloadCertificatePDF } from '../lib/pdfGenerator';

export default function CourseComplete() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery<CourseOut>({
    queryKey: ['course', slug],
    queryFn: () => api.get(`/courses/${slug}`).then(r => r.data),
    enabled: !!slug
  });

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AppShell>
    );
  }

  if (!course) return null;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative overflow-hidden">
        {/* Confetti background effect (simplified) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <BreadcrumbNav items={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: course.title, href: `/courses/${course.slug}` },
          { label: 'Completion' }
        ]} />

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 sm:p-12 mb-8 relative">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="text-yellow-600 w-12 h-12" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Course Completed!
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Amazing job! You've successfully completed <span className="font-bold text-indigo-600">{course.title}</span>.
          </p>

          {/* Certificate Placeholder */}
          <div className="max-w-2xl mx-auto bg-slate-50 border-8 border-double border-slate-200 p-8 rounded-xl mb-10 relative">
            <div className="absolute top-4 right-4 text-slate-300">
              <Award size={48} />
            </div>
            <div className="text-sm tracking-widest text-slate-400 uppercase font-bold mb-4">Certificate of Completion</div>
            <div className="text-2xl font-bold text-slate-800 mb-2">{me?.user?.email?.split('@')[0] || 'Student Name'}</div>
            <div className="text-slate-500 mb-6">has successfully completed</div>
            <div className="text-2xl font-extrabold text-indigo-700 mb-6 font-serif">{course.title}</div>
            <div className="flex justify-between items-end border-t border-slate-200 pt-4 mt-8">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Date</div>
                <div className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Platform</div>
                <div className="text-sm font-bold text-slate-700">StudentRoadmap</div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 mb-10 inline-block text-left">
            <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={20} />
              Skills you've mastered:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.skills_gained?.map((skill, i) => (
                <li key={i} className="flex items-center gap-2 text-emerald-800 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => generateAndDownloadCertificatePDF({
                studentName: me?.user?.email?.split('@')[0] || 'Student',
                courseTitle: course.title,
                skillsGained: course.skills_gained || [],
                courseSlug: course.slug
              })}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Award size={18} /> Download Certificate (PDF)
            </button>
            <Link 
              to="/roadmaps"
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Return to Roadmap <ArrowRight size={18} />
            </Link>
            <Link 
              to="/courses"
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl transition-colors flex items-center justify-center"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
