import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] ERROR: SUPABASE_URL atau SUPABASE_KEY belum diisi di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
