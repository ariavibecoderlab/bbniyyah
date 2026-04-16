import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { DIMENSIONS } from '../lib/constants'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [todayCheckin, setTodayCheckin] = useState(false)
  const [latestScores, setLatestScores] = useState<Record<string, number>>({})

  useEffect(() => {
    if (user) {
      checkTodayCheckin()
      fetchScores()
    }
  }, [user])

  const checkTodayCheckin = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('bb_checkins')
      .select('id')
      .eq('student_id', user!.id)
      .eq('checkin_date', today)
      .maybeSingle()
    setTodayCheckin(!!data)
  }

  const fetchScores = async () => {
    const { data } = await supabase
      .from('bb_assessments')
      .select('dimension, score, created_at')
      .eq('student_id', user!.id)
      .eq('assessor_type', 'self')
      .order('created_at', { ascending: false })
    
    if (data) {
      const latest: Record<string, number> = {}
      data.forEach((a: any) => {
        if (!(a.dimension in latest)) latest[a.dimension] = a.score
      })
      setLatestScores(latest)
    }
  }

  const ageBand = profile?.age_band
  const ageLabel = ageBand ? { buds: '🌱 Buds', shoots: '🌿 Shoots', branches: '🌳 Branches', fruits: '🍎 Fruits' }[ageBand] : ''
  const overallScore = Object.keys(latestScores).length > 0
    ? (Object.values(latestScores).reduce((a, b) => a + b, 0) / Object.keys(latestScores).length).toFixed(1)
    : '—'

  return (
    <div className="min-h-screen p-4 pb-24 islamic-pattern">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {getGreeting()} {profile?.full_name?.split(' ')[0]} 🌙
              </h1>
              <p className="text-gray-500 text-sm">{ageLabel} • Brainy Bunch</p>
            </div>
            <div className="text-center">
              <div className="text-3xl glow rounded-full p-2">🔥</div>
              <div className="text-sm font-bold text-primary">{profile?.streak_count || 0}</div>
            </div>
          </div>

          {/* Niyyah */}
          {profile?.niyyah_statement && (
            <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-600 italic">
              🤲 "{profile.niyyah_statement}"
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-primary">{overallScore}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">{Object.keys(latestScores).length}/8</div>
            <div className="text-xs text-gray-500">Assessed</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{profile?.streak_count || 0}</div>
            <div className="text-xs text-gray-500">Streak 🔥</div>
          </div>
        </div>

        {/* Today's Check-In */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Daily Check-In</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {todayCheckin ? '✅ Done for today!' : 'Complete your muhasabah'}
              </p>
            </div>
            <button
              onClick={() => !todayCheckin && navigate('/checkin')}
              disabled={todayCheckin}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                todayCheckin
                  ? 'bg-green-100 text-green-600'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md'
              }`}
            >
              {todayCheckin ? 'Done ✓' : 'Check In'}
            </button>
          </div>
        </div>

        {/* Dimension Quick View */}
        <h3 className="font-semibold text-gray-700 mb-3">8 Dimensions</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {DIMENSIONS.map(dim => (
            <button
              key={dim.id} onClick={() => navigate('/progress')}
              className="glass rounded-xl p-3 text-center hover:shadow-md transition"
            >
              <div className="text-xl mb-1">{dim.icon}</div>
              <div className="text-xs text-gray-600 truncate">{dim.label.split(' ')[0]}</div>
              <div className="text-sm font-bold mt-1" style={{ color: dim.color }}>
                {latestScores[dim.id] || '—'}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/goals')}
            className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition text-left"
          >
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-medium text-gray-800">My Goals</div>
              <div className="text-xs text-gray-500">Set and track your growth goals</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition text-left"
          >
            <span className="text-2xl">📈</span>
            <div>
              <div className="font-medium text-gray-800">Full Progress</div>
              <div className="text-xs text-gray-500">View radar chart & detailed scores</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
