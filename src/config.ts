// ============================================================
// API Configuration
// Set VITE_API_BASE_URL in your Vercel environment variables
// to point to your HuggingFace Space backend URL.
// e.g. https://your-username-acpc-chatbot.hf.space
// ============================================================
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
