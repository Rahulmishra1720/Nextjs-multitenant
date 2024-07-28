import { createClient } from '@supabase/supabase-js';

//supabase
const supaBaseProjectUrl: string = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supaBaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABSE_ANON_KEY!;
export const supabase = createClient(supaBaseProjectUrl, supaBaseAnonKey);