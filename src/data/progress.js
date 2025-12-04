import { supabase } from "../lib/supabase.js";

export async function saveProgress(userId, quizName, score) {
  return supabase.from("user_progress").insert({
    user_id: userId,
    quiz_name: quizName,
    score,
  });
}

export async function getProgress(userId) {
  return supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}
