import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Variaveis de ambiente nao configuradas.\n" +
      "Crie um arquivo .env.local com:\n" +
      "  VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co\n" +
      "  VITE_SUPABASE_ANON_KEY=sua_anon_key\n" +
      "Consulte README.md para instrucoes completas."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key"
);

/** Retorna true se as variaveis de ambiente do Supabase estao configuradas. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
