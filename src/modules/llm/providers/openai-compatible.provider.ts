import { ApiError } from "../../../utils/api-error";
import { logger } from "../../../infrastructure/logging/logger";
import { LLMProvider } from "./llm.provider";
import { LLMRequest, LLMResponse } from "../llm.types";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface OpenAiCompatibleConfig {
  providerName: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  extraHeaders?: Record<string, string>;
}

// Shared by any provider that speaks the OpenAI chat-completions protocol (Venice, OpenRouter, ...).
export class OpenAiCompatibleProvider implements LLMProvider {
  constructor(private readonly config: OpenAiCompatibleConfig) {}

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const { providerName, baseUrl, apiKey, model, extraHeaders } = this.config;
    const startedAt = Date.now();

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...extraHeaders,
          },
          body: JSON.stringify({
            model,
            messages: request.messages,
            max_tokens: request.maxTokens ?? 1000,
            temperature: request.temperature ?? 0.9,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
            await sleep(2 ** attempt * 500);
            continue;
          }
          const body = await response.text().catch(() => "");
          logger.error({ status: response.status, body }, `${providerName} API request failed`);
          throw new ApiError(502, "AI provider request failed");
        }

        const data = (await response.json()) as {
          choices: { message: { content: string } }[];
          model: string;
          usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        };

        return {
          content: data.choices[0]?.message?.content ?? "",
          model: data.model ?? model,
          usage: {
            inputTokens: data.usage?.prompt_tokens ?? 0,
            outputTokens: data.usage?.completion_tokens ?? 0,
            totalTokens: data.usage?.total_tokens ?? 0,
          },
          latencyMs: Date.now() - startedAt,
        };
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (attempt < MAX_RETRIES) {
          await sleep(2 ** attempt * 500);
          continue;
        }
        logger.error({ err }, `${providerName} API request errored`);
        throw new ApiError(502, "AI provider is unavailable");
      } finally {
        clearTimeout(timeout);
      }
    }

    throw new ApiError(502, "AI provider is unavailable");
  }
}
