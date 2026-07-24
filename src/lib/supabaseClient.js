import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xrzbvuehrojksdjhzulp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyemJ2dWVocm9qa3Nkamh6dWxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU0NzQ4NywiZXhwIjoyMDk4MTIzNDg3fQ.yMOwnUPjRFsAD28IT38JGkAwHTJ__Q59msa3WjHsfVU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Sync Google User to Supabase users table
 */
export async function syncUserToSupabase(user) {
  if (!user || !user.email) return null;

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingUser) {
      console.log('✅ Supabase: Found existing user', existingUser.email);
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
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase user insert error:', error.message);
      return null;
    }

    console.log('✅ Supabase: Created new user', newUser.email);
    return newUser;
  } catch (err) {
    console.error('Supabase syncUser error:', err);
    return null;
  }
}

/**
 * Record SePay Payment Transaction to Supabase payments table
 */
export async function syncPaymentToSupabase({ plan, amount, referenceCode, status = 'completed' }) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          plan: plan.toUpperCase(),
          amount: amount,
          reference_code: referenceCode || 'AVALIVE8912',
          status: status,
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase payment record error:', error.message);
      return null;
    }

    console.log('✅ Supabase: Synced SePay payment record successfully', data);
    return data;
  } catch (err) {
    console.error('Supabase syncPayment error:', err);
    return null;
  }
}
