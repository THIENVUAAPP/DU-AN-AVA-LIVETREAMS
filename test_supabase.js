import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://smuqgdcjpzchuidfbchf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdXFnZGNqcHpjaHVpZGZiY2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTgwMDYsImV4cCI6MjEwMDQ3NDAwNn0.aDseYN5EebwwCyDSNmT1HSjNgwdf9h55xYdjlp_JaXs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    // try to get a user
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
}

run();
