import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Careers from './pages/Careers'
import CareerDetail from './pages/CareerDetail'
import Roadmap from './pages/Roadmap'
import RoadmapsList from './pages/RoadmapsList'
import Profile from './pages/Profile'
import SkillDoc from './pages/SkillDoc'
import ResourceLearn from './pages/ResourceLearn'
import { isLoggedIn } from './lib/auth'


const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/careers" element={<PrivateRoute><Careers /></PrivateRoute>} />
          <Route path="/careers/:slug" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/roadmaps" element={<PrivateRoute><RoadmapsList /></PrivateRoute>} />
          <Route path="/roadmaps/:id" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
          <Route path="/skills/:slug" element={<PrivateRoute><SkillDoc /></PrivateRoute>} />
          <Route path="/learn/:resourceId" element={<PrivateRoute><ResourceLearn /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
