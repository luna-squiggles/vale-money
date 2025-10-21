import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!')
  console.log('VITE_SUPABASE_URL:', supabaseUrl)
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface PinSubmission {
  id?: string
  lng: number
  lat: number
  label: string
  created_at?: string
  approved?: boolean
}

export interface FormSubmission {
  id?: string
  pins: PinSubmission[]
  form_data: Record<string, any>
  created_at?: string
  approved?: boolean
}
