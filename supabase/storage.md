# Supabase Storage

Create a storage bucket named:

```text
issue-images
```

Recommended settings for this project:

- Public bucket: enabled
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

The Express backend uses `SUPABASE_SERVICE_ROLE_KEY`, so uploads will be handled server-side in a later step.
