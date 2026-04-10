import { OpenRouter } from "@openrouter/sdk";
import "dotenv/config";

// Initialize OpenRouter client
export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Default model as requested by user
export const DEFAULT_MODEL = "google/gemma-3-12b-it:free";
