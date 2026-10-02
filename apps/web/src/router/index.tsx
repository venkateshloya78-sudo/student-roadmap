import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout }        from '../components/Layout/AppLayout';
import { Landing }          from '../pages/Landing';
import { Login }            from '../pages/Login';
import { Register }         from '../pages/Register';
import { Dashboard }        from '../pages/Dashboard';
import { RoadmapPage }      from '../pages/Roadmap';
import { CareersPage }      from '../pages/Careers';
import { CareerDetailPage } from '../pages/CareerDetail';
import { ProgressPage }     from '../pages/Progress';
import { ProfilePage }      from '../pages/Profile';
import { OnboardingWizard } from '../pages/Onboarding';

export const router = createBrowserRouter([
  { path: '/',           element: <Landing /> },
  { path: '/login',      element: <Login /> },
  { path: '/register',   element: <Register /> },
  { path: '/onboarding', element: <OnboardingWizard /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard',        element: <Dashboard /> },
      { path: '/roadmap',          element: <RoadmapPage /> },
      { path: '/careers',          element: <CareersPage /> },
      { path: '/careers/:slug',    element: <CareerDetailPage /> },
      { path: '/progress',         element: <ProgressPage /> },
      { path: '/profile',          element: <ProfilePage /> },
      { path: '*',                 element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
