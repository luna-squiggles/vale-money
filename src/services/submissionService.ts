import { supabase, PinSubmission, FormSubmission } from '../lib/supabase'

export const submitConsultationData = async (pins: PinSubmission[], formData: Record<string, any>) => {
  try {
    // Create a submission record
    const { data: submission, error: submissionError } = await supabase
      .from('consultation_submissions')
      .insert({
        pins: pins,
        form_data: formData,
        approved: false, // Default to false for moderation
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error submitting consultation data:', submissionError)
      throw submissionError
    }

    return submission
  } catch (error) {
    console.error('Failed to submit consultation data:', error)
    throw error
  }
}

export const getApprovedPins = async () => {
  try {
    const { data, error } = await supabase
      .from('consultation_submissions')
      .select('pins')
      // Remove the approved filter for now to show all pins
      // .eq('approved', true)

    if (error) {
      console.error('Error fetching pins:', error)
      throw error
    }

    console.log('Raw submissions from database:', data)

    // Flatten all pins from all submissions
    const allPins = data.flatMap(submission => submission.pins)
    console.log('Flattened pins:', allPins)
    return allPins
  } catch (error) {
    console.error('Failed to fetch pins:', error)
    throw error
  }
}

export const getAllSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('consultation_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    throw error
  }
}
