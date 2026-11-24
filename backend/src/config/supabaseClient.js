import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use the server-only service role key for private user-account operations.
// SUPABASE_KEY remains as a backward-compatible fallback for existing setups.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
