import { createClient } from '@supabase/supabase-js';

// NEW OFFICIAL SUPABASE PROJECT CREDENTIALS
const SUPABASE_URL = 'https://smuqgdcjpzchuidfbchf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdXFnZGNqcHpjaHVpZGZiY2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTgwMDYsImV4cCI6MjEwMDQ3NDAwNn0.aDseYN5EebwwCyDSNmT1HSjNgwdf9h55xYdjlp_JaXs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Sync Google / Gmail User to Supabase users table
 */
export async function syncUserToSupabase(user) {
  if (!user || !user.email) return null;

  try {
    const email = user.email.toLowerCase().trim();
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      console.log('✅ Supabase: Found existing user', existingUser.email);
      // If local user has updated info, merge it
      const updatedUser = {
        ...existingUser,
        name: user.name || existingUser.name,
        avatar_url: user.avatar || existingUser.avatar_url,
        role: (email === 'quocthiencr90@gmail.com') ? 'admin' : (existingUser.role || 'user'),
        isAdmin: email === 'quocthiencr90@gmail.com' || existingUser.role === 'admin'
      };
      return updatedUser;
    }

    const isSuperAdmin = email === 'quocthiencr90@gmail.com';
    const newUserRecord = {
      email: email,
      name: user.name || email.split('@')[0],
      avatar_url: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: isSuperAdmin ? 'admin' : 'user',
      plan: isSuperAdmin ? 'VIP PRO' : 'STARTER',
      tokens: isSuperAdmin ? 999999 : 100000,
      balance: 0,
      used_live_sessions: 0,
      live_minutes_used: 0,
      referral_code: email.split('@')[0],
      created_at: new Date().toISOString()
    };

    const { data: createdUser, error } = await supabase
      .from('users')
      .insert([newUserRecord])
      .select()
      .maybeSingle();

    if (error) {
      console.log('Supabase users insert note:', error.message);
      return {
        ...newUserRecord,
        isAdmin: isSuperAdmin
      };
    }

    console.log('✅ Supabase: Created new user', createdUser?.email);
    return {
      ...createdUser,
      isAdmin: isSuperAdmin || createdUser?.role === 'admin'
    };
  } catch (err) {
    console.warn('Supabase syncUser caught:', err);
    return user;
  }
}

/**
 * Fetch Full User Account Profile from Supabase
 */
export async function fetchUserProfile(email) {
  if (!email) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...data,
      isAdmin: data.email === 'quocthiencr90@gmail.com' || data.role === 'admin'
    };
  } catch (err) {
    console.error('Fetch user profile error:', err);
    return null;
  }
}

/**
 * Realtime Token Update (Add / Deduct points and tokens)
 */
export async function updateUserTokens(email, deltaTokens, reason = 'Sử dụng AI Live') {
  if (!email) return null;
  try {
    const cleanEmail = email.toLowerCase().trim();
    // 1. Get current tokens
    const { data: user } = await supabase
      .from('users')
      .select('tokens')
      .eq('email', cleanEmail)
      .maybeSingle();

    const currentTokens = user?.tokens !== undefined ? user.tokens : 100000;
    const newTokens = Math.max(0, currentTokens + deltaTokens);

    await supabase
      .from('users')
      .update({ tokens: newTokens })
      .eq('email', cleanEmail);

    // Update local storage
    try {
      localStorage.setItem('avalive_user_tokens', newTokens.toString());
      const savedUser = localStorage.getItem('avalive_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        u.tokens = newTokens;
        localStorage.setItem('avalive_current_user', JSON.stringify(u));
      }
    } catch (e) {}

    console.log(`⚡ Supabase: Tokens updated for ${cleanEmail}: ${currentTokens} -> ${newTokens} (${reason})`);
    return newTokens;
  } catch (err) {
    console.warn('updateUserTokens error:', err);
    return null;
  }
}

/**
 * Update Livestream Duration Time (Minutes)
 */
export async function updateUserLiveTime(email, additionalMinutes = 1) {
  if (!email) return;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const { data: user } = await supabase
      .from('users')
      .select('live_minutes_used')
      .eq('email', cleanEmail)
      .maybeSingle();

    const currentMins = user?.live_minutes_used || 0;
    await supabase
      .from('users')
      .update({ live_minutes_used: currentMins + additionalMinutes })
      .eq('email', cleanEmail);
  } catch (err) {
    console.warn('updateUserLiveTime error:', err);
  }
}

/**
 * Record SePay Payment Transaction to Supabase payments table
 */
export async function syncPaymentToSupabase({ plan, amount, referenceCode, status = 'completed', email, billingCycle = 'monthly' }) {
  try {
    const cleanEmail = (email || '').toLowerCase().trim();
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          plan: plan ? plan.toUpperCase() : 'STARTER',
          amount: amount,
          reference_code: referenceCode || `AVALIVE_${Date.now()}`,
          status: status,
          user_email: cleanEmail,
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
    if (cleanEmail && status === 'completed') {
       const daysToAdd = billingCycle === 'annual' ? 365 : 30;
       const expiresAt = new Date(Date.now() + daysToAdd * 86400000).toISOString();
       await supabase.from('users').update({ 
           plan: plan ? plan.toUpperCase() : 'STARTER',
           plan_expires_at: expiresAt
       }).eq('email', cleanEmail);
       
       // Update local storage explicitly
       try {
           const saved = localStorage.getItem("avalive_current_user");
           if (saved) {
               let parsedUser = JSON.parse(saved);
               if (parsedUser.email === cleanEmail) {
                   parsedUser.plan = plan ? plan.toUpperCase() : 'STARTER';
                   parsedUser.plan_expires_at = expiresAt;
                   localStorage.setItem("avalive_current_user", JSON.stringify(parsedUser));
               }
           }
       } catch (e) {}
    }

    console.log('✅ Supabase: Synced SePay payment record successfully', data);
    return data;
  } catch (err) {
    console.warn('Supabase syncPayment caught:', err);
    return null;
  }
}

