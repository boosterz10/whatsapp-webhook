const express = require("express");
const app = express();

/**
 * Meta uses this ONLY for verification.
 * It will NOT be shown again in the dashboard.
 */
const VERIFY_TOKEN = "TEST123";

/**
 * IMPORTANT:
 * This middleware allows Meta to send JSON payloads
 */
app.use(express.json());

/**
 * 1️⃣ GET /webhooks
 * Used ONCE by Meta to verify your webhook
 */
app.get("/webhooks", (req, res) => {
  console.log("🔍 Verification request:", req.query);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Verification failed");
  return res.sendStatus(403);
});

/**
 * 2️⃣ POST /webhooks
 * Used EVERY TIME a WhatsApp message is received
 */
app.post("/webhooks", (req, res) => {
  console.log("📩 Incoming WhatsApp webhook:");
  console.log(JSON.stringify(req.body, null, 2));

  // Always respond 200 to Meta
  res.sendStatus(200);
});

/**
 * 3️⃣ Start server
 * Render assigns the PORT via environment variable
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible at your Render URL`);
});

