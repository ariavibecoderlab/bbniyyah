import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { DIMENSIONS, ASSESSMENT_QUESTIONS } from '../lib/constants'
import type { DimensionId, AgeBand } from '../lib/constants'

export default function BaselinePage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [currentDim, setCurrentDim] = useState(0)
  const [scores, setScores] = useState<Record<DimensionId, number>>({} as any)
  const [notes, setNotes] = useState<Record<DimensionId, string>>({} as any)
  const [saving, setSaving] = useState(false)

  const ageBand = profile?.age_band as AgeBand
  const dimension = DIMENSIONS[currentDim]
  const questions = ASSESSMENT_QUESTIONS[ageBand]?.[dimension.id] || []

  const isBuds = ageBand === 'buds'
  const isShoots = ageBand === 'shoots'

  const getScoreLabel = (score: number) => {
    if (isBuds) {
      return ['', '😟 Just starting', '😐 Sometimes', '😊 Most days', '🌟 Every day!', '✨ Every day + help others!'][score]
    }
    if (isShoots) {
      return ['', '⭐ I avoid it', '⭐⭐ When I have to', '⭐⭐⭐ Regularly', '⭐⭐⭐⭐ Consistently', '⭐⭐⭐⭐⭐ I teach others'][score]
    }
    return ['', '1 - Struggling', '2 - Inconsistent', '3 - Growing', '4 - Strong', '5 - Leading others'][score]
  }

  const handleNext = async () => {
    if (currentDim < DIMENSIONS.length - 1) {
      setCurrentDim(currentDim + 1)
    } else {
      // Save all assessments
      setSaving(true)
      try {
        const period = new Date().toISOString().split('T')[0]
        const inserts = DIMENSIONS.map(dim => ({
          student_id: user!.id,
          assessor_type: 'self',
          assessor_id: user!.id,
          dimension: dim.id,
          score: scores[dim.id] || 3,
          notes: notes[dim.id] || null,
          period,
          age_band_at_time: ageBand,
        }))
        await supabase.from('bb_assessments').insert(inserts)
        await refreshProfile()
        navigate('/dashboard')
      } catch (err) {
        console.error(err)
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 islamic-pattern">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in shadow-xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{dimension.icon} {dimension.label}</span>
            <span>{currentDim + 1} / {DIMENSIONS.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentDim + 1) / DIMENSIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {dimension.icon} How are you doing in {dimension.label}?
        </h2>

        {/* Questions */}
        <div className="space-y-3 mb-6">
          {questions.map((q, i) => (
            <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {i + 1}. {q}
            </div>
          ))}
        </div>

        {/* Score Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Rate yourself:</p>
          {isBuds ? (
            <div className="flex justify-center gap-4">
              {[
                { val: 1, emoji: '😟', label: 'Just starting' },
                { val: 3, emoji: '😐', label: 'Most days' },
                { val: 5, emoji: '😊', label: 'Every day!' },
              ].map(opt => (
                <button
                  key={opt.val} onClick={() => setScores({ ...scores, [dimension.id]: opt.val })}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition ${
                    scores[dimension.id] === opt.val
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <span className="text-3xl mb-1">{opt.emoji}</span>
                  <span className="text-xs text-gray-600">{opt.label}</span>
                </button>
              ))}
            </div>
          ) : isShoots ? (
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s} onClick={() => setScores({ ...scores, [dimension.id]: s })}
                  className={`w-12 h-12 rounded-xl font-bold transition ${
                    scores[dimension.id] === s
                      ? 'bg-primary text-white shadow-md scale-110'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s} onClick={() => setScores({ ...scores, [dimension.id]: s })}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${
                    scores[dimension.id] === s
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{getScoreLabel(s)}</span>
                </button>
              ))}
            </div>
          )}
          {scores[dimension.id] && (
            <p className="text-center text-sm text-primary mt-2 font-medium">
              {getScoreLabel(scores[dimension.id])}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <textarea
            value={notes[dimension.id] || ''} onChange={e => setNotes({ ...notes, [dimension.id]: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none text-sm"
            placeholder="Any notes? What went well? What to improve?"
          />
        </div>

        <button
          onClick={handleNext} disabled={!scores[dimension.id] || saving}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition disabled:opacity-40"
        >
          {saving ? 'Saving...' : currentDim < DIMENSIONS.length - 1 ? 'Next Dimension →' : 'Complete Assessment ✨'}
        </button>
      </div>
    </div>
  )
}
