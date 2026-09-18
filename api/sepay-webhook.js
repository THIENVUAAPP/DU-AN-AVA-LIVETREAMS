import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://smuqgdcjpzchuidfbchf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdXFnZGNqcHpjaHVpZGZiY2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTgwMDYsImV4cCI6MjEwMDQ3NDAwNn0.aDseYN5EebwwCyDSNmT1HSjNgwdf9h55xYdjlp_JaXs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // SePay Authorization check (if configured in env)
  const authHeader = req.headers['authorization'] || req.headers['x-api-key'] || '';
  const expectedKey = process.env.SEPAY_API_KEY;
  if (expectedKey && !authHeader.includes(expectedKey)) {
    return res.status(401).json({ success: false, message: 'Unauthorized webhook request' });
  }

  try {
    const data = req.body || {};
    if (typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    
    // SePay payload
    const content = data.transactionContent || data.content || '';
    const amountIn = parseInt(data.transferAmount || data.amountIn || 0, 10);

    const match = content.match(/AVA\d+/i);
    
    if (!match) {
      return res.status(200).json({ success: true, message: 'No AVA code found, ignoring.' });
    }

    const orderCode = match[0].toUpperCase();

    // Find pending payment
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('reference_code', orderCode)
      .eq('status', 'pending')
      .maybeSingle();

    if (fetchError || !payment) {
      return res.status(200).json({ success: true, message: 'Order not found or already completed' });
    }

    // Update payment
    await supabase
      .from('payments')
      .update({ status: 'completed', paid_at: new Date().toISOString() })
      .eq('reference_code', orderCode);

    // Update user
    const email = payment.user_email;
    if (email) {
       // A proper webhook should know if it's monthly/yearly. We assume monthly for now unless amount > 1.29M (enterprise) etc.
       // For safety, let's just use 30 days as base, but it depends on the package. 
       const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

       await supabase
         .from('users')
         .update({ 
             plan: payment.plan,
             plan_expires_at: expiresAt
         })
         .eq('email', email);
    }

    return res.status(200).json({ success: true, message: 'Payment processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
