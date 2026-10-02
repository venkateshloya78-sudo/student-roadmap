import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, GraduationCap, MapPin, Clock, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEGREE_LABELS: Record<string, string> = {
  btech: 'B.Tech / B.E.',
  bsc:   'B.Sc',
  bcom:  'B.Com / BBA',
  ba:    'B.A.',
  mtech: 'M.Tech',
  msc:   'M.Sc',
  other: 'Other',
};

export const ProfilePage = () => {
  const { user, profile } = useAuth();

  const fields = [
    { label: 'Degree',                value: profile?.degree ? DEGREE_LABELS[profile.degree] : '—', icon: GraduationCap },
    { label: 'Branch / Stream',       value: profile?.branch ?? '—',                                icon: GraduationCap },
    { label: 'University',            value: profile?.university ?? '—',                            icon: GraduationCap },
    { label: 'Year of Study',         value: profile?.year ? `Year ${profile.year}` : '—',          icon: Clock },
    { label: 'Graduation Year',       value: profile?.graduation_year?.toString() ?? '—',           icon: Clock },
    { label: 'Location',              value: profile?.location_city
        ? `${profile.location_city}${profile.location_state ? ', ' + profile.location_state : ''}`
        : '—',                                                                                      icon: MapPin },
    { label: 'Weekly Learning Hours', value: profile?.weekly_learning_hours
        ? `${profile.weekly_learning_hours} hrs / week` : '—',                                      icon: Clock },
    { label: 'Learning Style',        value: profile?.learning_style ?? '—',                        icon: User },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Your academic and career details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar */}
        <div className="card flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="font-semibold text-gray-900">{user?.email?.split('@')[0]}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="badge bg-brand-50 text-brand-700 mt-2 capitalize">{user?.role}</span>
          {profile?.profile_completed_at ? (
            <p className="text-xs text-emerald-600 mt-2 font-medium">✓ Profile complete</p>
          ) : (
            <Link to="/onboarding" className="mt-3 btn-primary text-xs py-1.5 px-3 gap-1.5">
              <Pencil className="w-3 h-3" /> Complete profile
            </Link>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-600" /> Academic Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex gap-3">
                <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {profile?.career_goal_text && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Career Goal</p>
              <p className="text-sm text-gray-700 leading-relaxed">{profile.career_goal_text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
