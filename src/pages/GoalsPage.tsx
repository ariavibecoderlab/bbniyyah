import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { DIMENSIONS } from '../lib/constants'
import type { DimensionId, AgeBand } from '../lib/constants'

export default function GoalsPage() {
  const { user, profile } = useAuth()
  const [goals, setGoals] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({ dimension: 'spiritual' as DimensionId, title: '', target_value: '', progress_percent: 0 })

  const ageBand = profile?.age_band as AgeBand

  useEffect(() => {
    if (user) fetchGoals()
  }, [user])

  const fetchGoals = async () => {
    const { data } = await supabase
      .from('bb_goals')
      .select('*')
      .eq('student_id', user!.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    setGoals(data || [])
  }

  const addGoal = async () => {
    if (!newGoal.title.trim()) return
    await supabase.from('bb_goals').insert({
      student_id: user!.id,
      ...newGoal,
      age_band: ageBand,
    })
    setNewGoal({ dimension: 'spiritual', title: '', target_value: '', progress_percent: 0 })
    setShowAdd(false)
    fetchGoals()
  }

  const updateProgress = async (id: string, percent: number) => {
    await supabase.from('bb_goals').update({ progress_percent: percent }).eq('id', id)
    fetchGoals()
  }

  const completeGoal = async (id: string) => {
    await supabase.from('bb_goals').update({ status: 'completed', progress_percent: 100 }).eq('id', id)
    fetchGoals()
  }

  const getDimInfo = (dimId: string) => DIMENSIONS.find(d => d.id === dimId)

  return (
    <div className="min-h-screen p-4 pb-24 islamic-pattern">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🎯 My Goals</h1>
            <p className="text-gray-500 text-sm mt-1">{goals.length} active goals</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl shadow-md hover:bg-primary-dark transition"
          >
            +
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map(goal => {
            const dim = getDimInfo(goal.dimension)
            return (
              <div key={goal.id} className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{dim?.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{dim?.label}</p>
                    {goal.target_value && (
                      <p className="text-xs text-gray-400 mt-1">Target: {goal.target_value}</p>
                    )}
                  </div>
                  {goal.progress_percent >= 100 ? (
                    <span className="text-green-500 text-sm font-bold">✅</span>
                  ) : (
                    <span className="text-primary text-sm font-bold">{goal.progress_percent}%</span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(goal.progress_percent, 100)}%` }}
                    />
                  </div>
                </div>
                {/* Quick progress update */}
                <div className="flex gap-1 mt-2">
                  {[10, 25, 50, 75, 100].map(p => (
                    <button
                      key={p} onClick={() => updateProgress(goal.id, p)}
                      className={`flex-1 py-1 rounded text-xs font-medium transition ${
                        goal.progress_percent >= p
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                {goal.progress_percent >= 75 && goal.progress_percent < 100 && (
                  <button
                    onClick={() => completeGoal(goal.id)}
                    className="mt-2 w-full py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                  >
                    Mark as Complete 🎉
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {goals.length === 0 && !showAdd && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No goals yet</h3>
            <p className="text-gray-500 text-sm mb-4">Set your first goal to start growing!</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition"
            >
              Add Your First Goal
            </button>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4">
            <div className="glass rounded-t-2xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-4">New Goal 🎯</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimension</label>
                <div className="grid grid-cols-4 gap-2">
                  {DIMENSIONS.map(dim => (
                    <button
                      key={dim.id} onClick={() => setNewGoal({ ...newGoal, dimension: dim.id })}
                      className={`p-2 rounded-lg text-center transition text-xs ${
                        newGoal.dimension === dim.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'border-2 border-transparent bg-gray-50'
                      }`}
                    >
                      <div className="text-lg">{dim.icon}</div>
                      <div className="text-gray-600 mt-1">{dim.label.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                <input
                  type="text" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="e.g. Pray Fajr on time for 30 days"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <input
                  type="text" value={newGoal.target_value} onChange={e => setNewGoal({ ...newGoal, target_value: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="e.g. 30 days streak"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal} disabled={!newGoal.title.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-40"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
