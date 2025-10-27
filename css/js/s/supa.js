import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
import { renderNav } from "./ui.js";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true }
});

export async function getSession() {
  const { data } = await supa.auth.getSession();
  return data.session;
}

export async function requireAuth() {
  const s = await getSession();
  if (!s) location.hash = "#/login";
  return s;
}

export async function signOut() {
  await supa.auth.signOut();
  renderNav(null);
  location.hash = "#/login";
}

export async function myMemberships() {
  const s = await getSession();
  if (!s) return [];
  const { data, error } = await supa
    .from("memberships")
    .select("workshop_id, role")
    .eq("user_id", s.user.id);
  if (error) throw error;
  return data;
}

export async function currentProfile() {
  const s = await getSession();
  if (!s) return null;
  const { data } = await supa.from("profiles").select("*").eq("uid", s.user.id).maybeSingle();
  return data;
}
