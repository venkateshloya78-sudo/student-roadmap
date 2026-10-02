import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

const perks = [
  'Free forever for core features',
  'Personalised roadmap in < 5 minutes',
  'No spam, no upsells',
];

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      navigate('/onboarding');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              Student<span className="text-brand-600">Roadmap</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your free account</h1>
          <p className="text-gray-500 mt-1">Get your personalised career roadmap today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">College email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input" placeholder="you@college.edu" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input" placeholder="Min. 8 characters" required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
              {loading ? <LoadingSpinner size="sm" /> : 'Create account & continue'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
