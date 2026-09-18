import { modelRouter } from "./model.router";
import { LLMRequest, LLMResponse } from "./llm.types";

export const llmGateway = {
  generate(request: LLMRequest): Promise<LLMResponse> {
    const provider = modelRouter.resolve();
    return provider.generate(request);
  },
};
