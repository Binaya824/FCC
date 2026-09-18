import { env } from "../../../config/env";
import { OpenAiCompatibleProvider } from "./openai-compatible.provider";

export class OpenRouterProvider extends OpenAiCompatibleProvider {
  constructor(model: string = env.openrouter.model) {
    super({
      providerName: "OpenRouter",
      baseUrl: env.openrouter.baseUrl,
      apiKey: env.openrouter.apiKey,
      model,
    });
  }
}
