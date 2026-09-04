import { createClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasSupabaseConfig() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseEnv();

  return Boolean(
    supabaseUrl &&
      supabaseServiceRoleKey &&
      !supabaseUrl.includes("your-project-ref") &&
      !supabaseServiceRoleKey.includes("your-service-role-key"),
  );
}

export function getSupabase() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseEnv();

  if (!hasSupabaseConfig()) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server environment.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseForUser(accessToken) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in server environment.",
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
