import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Careers() {
  const [search, setSearch] = useState('');

  const { data: careers, isLoading } = useQuery({
    queryKey: ['careers', search],
    queryFn: async () => {
      const res = await api.get(`/careers${search ? `?search=${search}` : ''}`);
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Browse Careers</h1>
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded shadow-sm"
        />
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careers?.map((career: any) => (
              <Link to={`/careers/${career.slug}`} key={career.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block">
                <h2 className="text-xl font-semibold text-indigo-600">{career.title}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">{career.description}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Top Skills:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-500">
                    {career.required_skills?.slice(0, 3).map((rs: any) => (
                      <li key={rs.id}>{rs.skill.name}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
