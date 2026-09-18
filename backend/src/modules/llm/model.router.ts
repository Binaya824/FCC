import { env } from "../../config/env";
import { LLMProvider } from "./providers/llm.provider";
import { VeniceProvider } from "./providers/venice.provider";
import { OpenRouterProvider } from "./providers/openrouter.provider";
import { DeepInfraProvider } from "./providers/deepinfra.provider";

// ponytail: static env-based provider choice for MVP. Upgrade to DB-backed
// model_configs + per-conversation model selection when that's actually needed.
export const modelRouter = {
  resolve(): LLMProvider {
    if (env.llmProvider === "openrouter") return new OpenRouterProvider();
    if (env.llmProvider === "deepinfra") return new DeepInfraProvider();
    return new VeniceProvider();
  },
};
