import { createClient } from '@supabase/supabase-js';

// NEW OFFICIAL SUPABASE PROJECT CREDENTIALS
const SUPABASE_URL = 'https://smuqgdcjpzchuidfbchf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdXFnZGNqcHpjaHVpZGZiY2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTgwMDYsImV4cCI6MjEwMDQ3NDAwNn0.aDseYN5EebwwCyDSNmT1HSjNgwdf9h55xYdjlp_JaXs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Sync Google User to new Supabase users table
 */
export async function syncUserToSupabase(user) {
  if (!user || !user.email) return null;

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (existingUser) {
      console.log('✅ New Supabase: Found existing user', existingUser.email);
      return existingUser;
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          avatar_url: user.avatar,
          role: user.isAdmin ? 'admin' : 'user',
          plan: 'FREE', // Default plan
          used_live_sessions: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.log('Supabase users table note:', error.message);
      return null;
    }

    console.log('✅ New Supabase: Created new user', newUser?.email);
    return newUser;
  } catch (err) {
    console.warn('Supabase syncUser caught:', err);
    return null;
  }
}

/**
 * Record SePay Payment Transaction to new Supabase payments table
 */
export async function syncPaymentToSupabase({ plan, amount, referenceCode, status = 'completed', email }) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          plan: plan ? plan.toUpperCase() : 'STARTER',
          amount: amount,
          reference_code: referenceCode || 'AVALIVE8912',
          status: status,
          user_email: email,
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.log('Supabase payments table note:', error.message);
      return null;
    }
    
    // Also upgrade the user's plan in users table
    if (email && status === 'completed') {
       await supabase.from('users').update({ plan: plan ? plan.toUpperCase() : 'STARTER' }).eq('email', email);
    }

    console.log('✅ New Supabase: Synced SePay payment record successfully', data);
    return data;
  } catch (err) {
    console.warn('Supabase syncPayment caught:', err);
    return null;
  }
}
