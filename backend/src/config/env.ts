import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGO_URI", "mongodb://localhost:27017/fantasy_chat"),
  llmProvider: (process.env.LLM_PROVIDER ?? "venice") as "venice" | "openrouter" | "deepinfra",
  venice: {
    apiKey: process.env.VENICE_API_KEY ?? "",
    baseUrl: process.env.VENICE_BASE_URL ?? "https://api.venice.ai/api/v1",
    model: process.env.VENICE_MODEL ?? "venice-uncensored",
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free",
  },
  deepinfra: {
    apiKey: process.env.DEEPINFRA_API_KEY ?? "",
    baseUrl: process.env.DEEPINFRA_BASE_URL ?? "https://api.deepinfra.com/v1/openai",
    model: process.env.DEEPINFRA_MODEL ?? "meta-llama/Meta-Llama-3.1-8B-Instruct",
  },
};
