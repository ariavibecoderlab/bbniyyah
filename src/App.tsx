import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import BaselinePage from './pages/BaselinePage'
import DashboardPage from './pages/DashboardPage'
import CheckinPage from './pages/CheckinPage'
import GoalsPage from './pages/GoalsPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-pulse">🌙</div></div>
  if (!user) return <Navigate to="/" replace />

  // Redirect to onboarding if age_band not set
  if (profile && !profile.age_band && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // Redirect to baseline if age_band set but no niyyah
  if (profile?.age_band && !profile.niyyah_statement && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // If fully onboarded, don't let them go back to onboarding
  if (profile?.age_band && profile?.niyyah_statement && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user || location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/baseline') return null

  const tabs = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/checkin', icon: '✅', label: 'Check-In' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/progress', icon: '📈', label: 'Progress' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200/50 z-50">
      <div className="max-w-md mx-auto flex">
        {tabs.map(tab => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path} onClick={() => navigate(tab.path)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition ${
                active ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, profile } = useAuth()
  const location = useLocation()

  // Auto-redirect logged-in users away from login page
  if (user && profile && location.pathname === '/') {
    if (!profile.age_band || !profile.niyyah_statement) {
      return <Navigate to="/onboarding" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/baseline" element={<ProtectedRoute><BaselinePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckinPage /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}
