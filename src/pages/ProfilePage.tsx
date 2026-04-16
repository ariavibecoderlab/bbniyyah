import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AGE_BANDS } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [niyyah, setNiyyah] = useState(profile?.niyyah_statement || '')
  const [saving, setSaving] = useState(false)

  const handleSaveNiyyah = async () => {
    setSaving(true)
    await updateProfile({ niyyah_statement: niyyah })
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const ageBand = AGE_BANDS.find(b => b.id === profile?.age_band)

  return (
    <div className="min-h-screen p-4 pb-24 islamic-pattern">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h1>

        {/* Profile Card */}
        <div className="glass rounded-2xl p-6 mb-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            {profile?.role === 'student' ? '📚' : profile?.role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{profile?.full_name}</h2>
          <p className="text-gray-500 text-sm capitalize">{profile?.role} • {ageBand?.emoji} {ageBand?.label || 'Not set'}</p>
          <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
        </div>

        {/* Niyyah */}
        <div className="glass rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">🤲 My Niyyah</h3>
          <textarea
            value={niyyah} onChange={e => setNiyyah(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none text-sm"
          />
          <button
            onClick={handleSaveNiyyah} disabled={saving}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Niyyah'}
          </button>
        </div>

        {/* Streak */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">🔥 Check-In Streak</h3>
              <p className="text-xs text-gray-500 mt-0.5">Keep your daily muhasabah going!</p>
            </div>
            <div className="text-3xl font-bold text-primary">{profile?.streak_count || 0}</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => navigate('/baseline')}
            className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition text-left"
          >
            <span className="text-xl">📊</span>
            <div>
              <div className="font-medium text-gray-800">Re-do Baseline Assessment</div>
              <div className="text-xs text-gray-500">Update your 8-dimension scores</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition text-left"
          >
            <span className="text-xl">⚙️</span>
            <div>
              <div className="font-medium text-gray-800">Change Age Band</div>
              <div className="text-xs text-gray-500">Update your age group setting</div>
            </div>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
        >
          Sign Out
        </button>

        <div className="text-center mt-6 text-xs text-gray-400">
          BBNiyyah v1.0 • Brainy Bunch Islamic Montessori
        </div>
      </div>
    </div>
  )
}
