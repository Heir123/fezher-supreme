 import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is authenticated
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session, error }
}

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user, error }
}