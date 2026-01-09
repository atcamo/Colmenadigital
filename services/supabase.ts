
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Faltan las credenciales de Supabase. La persistencia de datos no funcionará.");
}

// Inicializamos solo si tenemos los valores, de lo contrario devolvemos null o un proxy
// para evitar que el error bloquee la carga inicial de la web.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;
