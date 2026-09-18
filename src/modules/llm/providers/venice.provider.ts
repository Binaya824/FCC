import { env } from "../../../config/env";
import { OpenAiCompatibleProvider } from "./openai-compatible.provider";

export class VeniceProvider extends OpenAiCompatibleProvider {
  constructor(model: string = env.venice.model) {
    super({
      providerName: "Venice",
      baseUrl: env.venice.baseUrl,
      apiKey: env.venice.apiKey,
      model,
    });
  }
}
