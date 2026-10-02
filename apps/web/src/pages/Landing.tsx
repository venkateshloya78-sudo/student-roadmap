import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">StudentRoadmap AI</h1>
      <p className="text-xl text-gray-600 mb-8">AI-powered career paths and learning roadmaps.</p>
      <div className="flex space-x-4">
        <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700">Login</Link>
        <Link to="/register" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md font-medium hover:bg-gray-300">Register</Link>
      </div>
    </div>
  );
}
