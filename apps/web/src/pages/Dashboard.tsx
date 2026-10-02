import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { isLoggedIn, clearToken } from '../lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    enabled: isLoggedIn(),
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading profile.</div>;

  const profileComplete = user?.degree && user?.branch && user?.year;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.email}!</h1>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
          <button 
            onClick={() => { clearToken(); navigate('/login'); }}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {!profileComplete && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Complete your profile to get better recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/careers" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-medium">Browse Careers</h3>
            <p className="text-gray-500 text-sm mt-2">Explore available career paths</p>
          </Link>
          <Link to="/roadmaps" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-medium">My Roadmaps</h3>
            <p className="text-gray-500 text-sm mt-2">View your learning paths</p>
          </Link>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-medium">My Skills</h3>
            <p className="text-gray-500 text-sm mt-2">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
