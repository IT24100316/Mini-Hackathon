import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { listAdminIssues, requireAdmin, updateIssueStatus } from "./admin.js";
import { createIssue, listIssues } from "./issues.js";
import { getSupabase, hasSupabaseConfig } from "./supabase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const host = process.env.HOST || "127.0.0.1";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
  }),
);
app.use(express.json({ limit: "7mb" }));

app.get("/", (_req, res) => {
  res.json({
    message: "FixMyArea LK API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fixmyarea-lk-api",
  });
});

app.get("/api/supabase/status", async (_req, res) => {
  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      status: "error",
      message:
        "Supabase environment variables are missing or still using placeholder values. Add real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values to server/.env.",
    });
  }

  try {
    const supabase = getSupabase();
    const checks = {
      database: false,
      storage: false,
    };

    const { error: databaseError } = await supabase
      .from("issues")
      .select("id,category,district,town,description,severity,status,image_url,created_at")
      .limit(1);

    checks.database = !databaseError;

    const { data: buckets, error: storageError } =
      await supabase.storage.listBuckets();

    checks.storage = Boolean(
      !storageError &&
        buckets?.some((bucket) => bucket.name === "issue-images"),
    );

    const errors = {
      database: databaseError?.message || null,
      storage: storageError?.message || null,
    };

    const ready = checks.database && checks.storage;

    return res.status(ready ? 200 : 500).json({
      status: ready ? "ok" : "error",
      checks,
      errors,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/api/issues", async (req, res) => {
  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      status: "error",
      message:
        "Supabase is not configured. Add real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values to server/.env.",
    });
  }

  try {
    const issues = await listIssues(req.query);
    return res.json({
      status: "ok",
      issues,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.post("/api/issues", async (req, res) => {
  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      status: "error",
      message:
        "Supabase is not configured. Add real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values to server/.env.",
    });
  }

  try {
    const result = await createIssue(req.body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/api/admin/issues", requireAdmin, async (req, res) => {
  try {
    const issues = await listAdminIssues(req.supabaseUser, req.query);
    return res.json({
      status: "ok",
      issues,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.patch("/api/admin/issues/:id/status", requireAdmin, async (req, res) => {
  try {
    const result = await updateIssueStatus(req.supabaseUser, req.params.id, req.body.status);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

const server = app.listen(port, host, () => {
  console.log(`FixMyArea LK API running on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start FixMyArea LK API", error);
  process.exit(1);
});
