import cors from "cors";
import dotenv from "dotenv";
import express from "express";

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

const server = app.listen(port, host, () => {
  console.log(`FixMyArea LK API running on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start FixMyArea LK API", error);
  process.exit(1);
});
