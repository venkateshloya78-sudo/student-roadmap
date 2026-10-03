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
import Assistant from './pages/Assistant'
import { isLoggedIn } from './lib/auth'


import CourseCatalog from './pages/CourseCatalog'
import CourseHome from './pages/CourseHome'
import LessonPage from './pages/LessonPage'
import ModuleQuiz from './pages/ModuleQuiz'
import CourseComplete from './pages/CourseComplete'

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
          
          {/* Courses Routes */}
          <Route path="/courses" element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />
          <Route path="/courses/:slug" element={<PrivateRoute><CourseHome /></PrivateRoute>} />
          <Route path="/courses/:slug/lessons/:lessonId" element={<PrivateRoute><LessonPage /></PrivateRoute>} />
          <Route path="/courses/:slug/modules/:moduleNum/quiz" element={<PrivateRoute><ModuleQuiz /></PrivateRoute>} />
          <Route path="/courses/:slug/complete" element={<PrivateRoute><CourseComplete /></PrivateRoute>} />

          <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
