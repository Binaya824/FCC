import { env } from "../../../config/env";
import { OpenAiCompatibleProvider } from "./openai-compatible.provider";

export class DeepInfraProvider extends OpenAiCompatibleProvider {
  constructor(model: string = env.deepinfra.model) {
    super({
      providerName: "DeepInfra",
      baseUrl: env.deepinfra.baseUrl,
      apiKey: env.deepinfra.apiKey,
      model,
    });
  }
}
