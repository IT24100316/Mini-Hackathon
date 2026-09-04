import { getSupabase, getSupabaseForUser } from "./supabase.js";

const adminStatuses = new Set(["pending", "in_progress", "resolved", "closed"]);

export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Admin login required.",
    });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired admin session.",
      });
    }

    const role =
      data.user.app_metadata?.role ||
      data.user.user_metadata?.role ||
      data.user.app_metadata?.user_role ||
      data.user.user_metadata?.user_role;

    if (role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Admin access required.",
      });
    }

    req.adminUser = data.user;
    req.supabaseUser = getSupabaseForUser(token);
    return next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function listAdminIssues(supabase, filters = {}) {
  let query = supabase
    .from("issues")
    .select("id,title,description,category,district,status,created_at")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.district) query = query.eq("district", filters.district);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateIssueStatus(supabase, id, status) {
  if (!id) {
    return {
      statusCode: 400,
      body: { status: "error", message: "Issue ID is required." },
    };
  }

  if (!adminStatuses.has(status)) {
    return {
      statusCode: 400,
      body: { status: "error", message: "Invalid complaint status." },
    };
  }

  const { data, error } = await supabase
    .from("issues")
    .update({ status })
    .eq("id", id)
    .select("id,title,description,category,district,status,created_at")
    .single();

  if (error) throw error;

  return {
    statusCode: 200,
    body: { status: "ok", issue: data },
  };
}
