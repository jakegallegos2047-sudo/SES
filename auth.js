import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bhpxdnfmabestlsoyepa.supabase.co';
const supabaseAnonKey = 'sb_publishable_Cx47-iinYGIEAOwX1k9IVQ_Rd_60HJl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function getUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function logout() {
  await supabase.auth.signOut();
}
