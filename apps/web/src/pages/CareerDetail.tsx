import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { isLoggedIn } from '../lib/auth';

export default function CareerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: career, isLoading } = useQuery({
    queryKey: ['career', slug],
    queryFn: async () => {
      const res = await api.get(`/careers/${slug}`);
      return res.data;
    }
  });

  const generateRoadmap = useMutation({
    mutationFn: async () => {
      const res = await api.post('/roadmaps/generate', {
        career_role_slug: slug,
        weekly_hours: 10
      });
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/roadmaps/${data.id}`);
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!career) return <div className="p-8">Career not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold">{career.title}</h1>
          <p className="text-sm text-indigo-500 font-semibold mb-4">{career.industry}</p>
          <p className="text-gray-700">{career.description}</p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {career.required_skills?.map((rs: any) => (
                    <tr key={rs.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rs.skill.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${rs.importance * 10}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.required_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-8">
            {isLoggedIn() ? (
              <button
                onClick={() => generateRoadmap.mutate()}
                disabled={generateRoadmap.isPending}
                className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {generateRoadmap.isPending ? 'Generating...' : 'Generate My Roadmap'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Login to Generate Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
