import crypto from "node:crypto";
import { getSupabase } from "./supabase.js";

const allowedSeverities = new Set(["low", "medium", "high"]);
const publicStatuses = new Set(["pending", "in_progress", "resolved"]);
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateIssue(input) {
  const errors = {};
  const issue = {
    category: String(input.category || "").trim(),
    district: String(input.district || "").trim(),
    town: String(input.town || "").trim(),
    description: String(input.description || "").trim(),
    severity: String(input.severity || "").trim().toLowerCase(),
  };

  if (!issue.category) errors.category = "Category is required.";
  if (!issue.district) errors.district = "District is required.";
  if (!issue.town) errors.town = "Town is required.";
  if (issue.description.length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }
  if (!allowedSeverities.has(issue.severity)) {
    errors.severity = "Severity must be low, medium, or high.";
  }

  return {
    issue,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}

export async function uploadIssueImage(supabase, image) {
  if (!image?.data || !image?.mimeType) return null;

  if (!allowedMimeTypes.has(image.mimeType)) {
    throw new Error("Image must be JPG, PNG, or WEBP.");
  }

  const extension = image.mimeType.split("/")[1].replace("jpeg", "jpg");
  const base64 = image.data.includes(",") ? image.data.split(",").pop() : image.data;
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("issue-images")
    .upload(path, buffer, {
      contentType: image.mimeType,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("issue-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function listIssues(filters = {}) {
  const supabase = getSupabase();
  let query = supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });

  query = query.in("status", [...publicStatuses]);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.district) query = query.eq("district", filters.district);
  if (filters.severity) query = query.eq("severity", filters.severity);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createIssue(input) {
  const validation = validateIssue(input);
  if (!validation.valid) {
    return {
      status: 400,
      body: {
        status: "error",
        errors: validation.errors,
      },
    };
  }

  const supabase = getSupabase();
  const imageUrl = await uploadIssueImage(supabase, input.image);

  const { data, error } = await supabase
    .from("issues")
    .insert({
      title: `${validation.issue.category} in ${validation.issue.town}`,
      ...validation.issue,
      status: "pending",
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    status: 201,
    body: {
      status: "ok",
      issue: data,
    },
  };
}
