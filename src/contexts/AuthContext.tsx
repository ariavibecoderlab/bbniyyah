import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { AgeBand } from '../lib/constants'

interface Profile {
  id: string
  full_name: string
  role: 'student' | 'teacher' | 'parent'
  age_band: AgeBand | null
  preferred_language: string
  niyyah_statement: string | null
  streak_count: number
}

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('bb_profiles').select('*').eq('id', userId).single()
    setProfile(data as Profile)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, role: string) => {
    const { data: { user: newUser }, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (newUser) {
      const { error: profileError } = await supabase.from('bb_profiles').upsert({
        id: newUser.id, full_name: name, role, age_band: null, preferred_language: 'en', streak_count: 0,
      })
      if (profileError) console.error('Profile insert error:', profileError)
      await fetchProfile(newUser.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return
    await supabase.from('bb_profiles').update(updates).eq('id', user.id)
    await fetchProfile(user.id)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
