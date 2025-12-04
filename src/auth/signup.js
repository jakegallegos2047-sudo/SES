import { supabase } from "../lib/supabase.js";

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}
