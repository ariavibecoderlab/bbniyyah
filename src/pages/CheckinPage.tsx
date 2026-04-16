import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { CHECKIN_QUESTIONS, DIMENSIONS } from '../lib/constants'
import type { AgeBand } from '../lib/constants'

export default function CheckinPage() {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const [responses, setResponses] = useState<Record<string, boolean>>({})
  const [mood, setMood] = useState<string>('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [loading, setLoading] = useState(true)

  const ageBand = profile?.age_band as AgeBand
  const questions = CHECKIN_QUESTIONS[ageBand] || CHECKIN_QUESTIONS.buds

  useEffect(() => {
    checkToday()
  }, [user])

  const checkToday = async () => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('bb_checkins')
      .select('id')
      .eq('student_id', user.id)
      .eq('checkin_date', today)
      .maybeSingle()
    if (data) setAlreadyDone(true)
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]

    // Calculate streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const { data: yesterdayCheckin } = await supabase
      .from('bb_checkins')
      .select('streak_count')
      .eq('student_id', user.id)
      .eq('checkin_date', yesterday)
      .maybeSingle()

    const newStreak = (yesterdayCheckin?.streak_count || 0) + 1

    await supabase.from('bb_checkins').insert({
      student_id: user.id,
      checkin_date: today,
      responses: responses,
      mood,
      note,
      streak_count: newStreak,
      age_band: ageBand,
    })

    await updateProfile({ streak_count: newStreak })
    setSubmitted(true)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl animate-pulse">🌙</div></div>

  if (alreadyDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 islamic-pattern">
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center animate-fade-in shadow-xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already checked in today!</h2>
          <p className="text-gray-500">Come back after Isha for tomorrow's muhasabah.</p>
          <div className="mt-4 text-3xl">🔥 {profile?.streak_count || 0} day streak</div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 islamic-pattern">
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center animate-fade-in shadow-xl">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Muhasabah Complete!</h2>
          <p className="text-gray-500 mb-4">May Allah accept your efforts today.</p>
          <div className="text-5xl mb-4 glow inline-block rounded-full p-4">🔥 {profile?.streak_count || 0}</div>
          <p className="text-gray-500">day streak — keep going!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pb-24 islamic-pattern">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🌙 Daily Check-In</h1>
          <p className="text-gray-500 text-sm mt-1">Your muhasabah for today</p>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`glass rounded-xl p-4 flex items-center justify-between transition ${
                responses[q.id] ? 'border-primary/30 bg-green-50/50' : ''
              }`}
            >
              <span className="text-gray-700 text-sm flex-1">{q.text}</span>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => setResponses({ ...responses, [q.id]: true })}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                    responses[q.id] === true
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  ✅
                </button>
                <button
                  onClick={() => setResponses({ ...responses, [q.id]: false })}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                    responses[q.id] === false
                      ? 'bg-red-100 text-red-500 shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mood */}
        <div className="glass rounded-xl p-4 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">How was your day?</p>
          <div className="flex justify-center gap-4">
            {[
              { emoji: '😊', label: 'Great', val: 'great' },
              { emoji: '😐', label: 'Okay', val: 'okay' },
              { emoji: '😟', label: 'Tough', val: 'tough' },
            ].map(m => (
              <button
                key={m.val} onClick={() => setMood(m.val)}
                className={`flex flex-col items-center p-3 rounded-xl transition ${
                  mood === m.val ? 'bg-primary/10 border-2 border-primary' : 'border-2 border-transparent'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs text-gray-500 mt-1">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        {(ageBand === 'branches' || ageBand === 'fruits') && (
          <div className="glass rounded-xl p-4 mt-4">
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none text-sm"
              placeholder="What went well? What to improve? Tomorrow's focus?"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={Object.keys(responses).length < questions.length}
          className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition disabled:opacity-40 shadow-md"
        >
          Submit Check-In 🌙
        </button>
      </div>
    </div>
  )
}
