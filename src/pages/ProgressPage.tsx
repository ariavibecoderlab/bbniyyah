import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { DIMENSIONS } from '../lib/constants'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function ProgressPage() {
  const { user, profile } = useAuth()
  const [assessments, setAssessments] = useState<any[]>([])
  const [selectedDim, setSelectedDim] = useState<string | null>(null)

  useEffect(() => {
    if (user) fetchAssessments()
  }, [user])

  const fetchAssessments = async () => {
    const { data } = await supabase
      .from('bb_assessments')
      .select('*')
      .eq('student_id', user!.id)
      .eq('assessor_type', 'self')
      .order('created_at', { ascending: false })
    setAssessments(data || [])
  }

  // Get latest score per dimension
  const getLatestScores = () => {
    const latest: Record<string, { score: number; date: string }> = {}
    assessments.forEach(a => {
      if (!latest[a.dimension] || new Date(a.created_at) > new Date(latest[a.dimension].date)) {
        latest[a.dimension] = { score: a.score, date: a.created_at }
      }
    })
    return DIMENSIONS.map(dim => ({
      dimension: dim.label.split(' ')[0],
      fullName: dim.label,
      icon: dim.icon,
      color: dim.color,
      score: latest[dim.id]?.score || 0,
      lastAssessed: latest[dim.id]?.date,
    }))
  }

  const chartData = getLatestScores()
  const radarData = chartData.map(d => ({ subject: d.dimension, score: d.score, fullMark: 5 }))

  const overallScore = chartData.length > 0
    ? (chartData.reduce((sum, d) => sum + d.score, 0) / chartData.filter(d => d.score > 0).length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen p-4 pb-24 islamic-pattern">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">📈 My Progress</h1>
        <p className="text-gray-500 text-sm mb-6">Your 8-dimension growth snapshot</p>

        {/* Overall Score */}
        <div className="glass rounded-xl p-4 mb-4 text-center">
          <div className="text-4xl font-bold text-primary">{overallScore}</div>
          <div className="text-sm text-gray-500">Overall Score (out of 5)</div>
          <div className="text-xs text-gray-400 mt-1">
            {chartData.filter(d => d.score > 0).length}/8 dimensions assessed
          </div>
        </div>

        {/* Radar Chart */}
        {chartData.some(d => d.score > 0) && (
          <div className="glass rounded-xl p-4 mb-4">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 9 }} />
                <Radar
                  name="Self Assessment"
                  dataKey="score"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Dimension Cards */}
        <div className="space-y-2">
          {chartData.map(dim => (
            <button
              key={dim.dimension}
              onClick={() => setSelectedDim(selectedDim === dim.dimension ? null : dim.dimension)}
              className="w-full glass rounded-xl p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dim.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{dim.fullName}</span>
                    <span className={`text-sm font-bold ${dim.score >= 4 ? 'text-green-600' : dim.score >= 3 ? 'text-accent' : dim.score > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {dim.score > 0 ? `${dim.score}/5` : 'Not assessed'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(dim.score / 5) * 100}%`, backgroundColor: dim.color }}
                    />
                  </div>
                </div>
              </div>

              {selectedDim === dim.dimension && dim.lastAssessed && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Last assessed: {new Date(dim.lastAssessed).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </button>
          ))}
        </div>

        {chartData.every(d => d.score === 0) && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No assessments yet</h3>
            <p className="text-gray-500 text-sm">Complete your baseline assessment to see your progress chart!</p>
          </div>
        )}
      </div>
    </div>
  )
}
