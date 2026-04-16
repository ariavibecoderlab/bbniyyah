import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AGE_BANDS } from '../lib/constants'
import type { AgeBand } from '../lib/constants'

export default function OnboardingPage() {
  const { profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [ageBand, setAgeBand] = useState<AgeBand | null>(profile?.age_band)
  const [niyyah, setNiyyah] = useState(profile?.niyyah_statement || '')

  const handleComplete = async () => {
    await updateProfile({ age_band: ageBand, niyyah_statement: niyyah })
    navigate('/baseline')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 islamic-pattern">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in shadow-xl">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-12 rounded-full transition ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`h-2 w-12 rounded-full transition ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {profile?.full_name}! 🌙</h2>
            <p className="text-gray-500 mb-6">Which age group are you in?</p>
            <div className="grid grid-cols-2 gap-3">
              {AGE_BANDS.map(band => (
                <button
                  key={band.id} onClick={() => setAgeBand(band.id)}
                  className={`p-4 rounded-xl border-2 transition text-center ${
                    ageBand === band.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{band.emoji}</div>
                  <div className="font-bold text-gray-800">{band.label}</div>
                  <div className="text-sm text-gray-500">Ages {band.age}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => ageBand && setStep(2)} disabled={!ageBand}
              className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your Niyyah 🤲</h2>
            <p className="text-gray-500 mb-6">Why are you here? What drives you every day?</p>
            
            <div className="bg-green-50 rounded-xl p-4 mb-4 text-sm text-gray-600">
              💡 <strong>Example:</strong> "I do this only to please Allah, follow the Prophet ﷺ, and honour my parents and teachers."
            </div>

            <textarea
              value={niyyah} onChange={e => setNiyyah(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              placeholder="Write your niyyah statement..."
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                onClick={handleComplete} disabled={!niyyah.trim()}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition disabled:opacity-40"
              >
                Start My Journey ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
