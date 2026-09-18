# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Fantasy Character Chat App — an AI-powered platform where users converse with persistent fantasy characters. Full design is in `FCC.pdf` (technical architecture doc); this repo currently implements the MVP subset of it.

**Repo layout:** `backend/` is the Node/Express API (everything below refers to paths under it). `application/` is the Flutter mobile client.

**MVP scope note:** authentication/users is intentionally not implemented yet (explicit product decision). There is no `auth` or `users` module, and documents have no `ownerId`/`userId` fields. Do not add auth-gated behavior unless asked. Redis, BullMQ, and the memory system are Phase 2/3 in the source doc and are also not implemented — there's no caching/queueing. The LLM path does support switching providers via `LLM_PROVIDER` (`venice` | `openrouter` | `deepinfra`), all going through the same `OpenAiCompatibleProvider` fetch client.

## Commands

Run from `backend/`:

- `npm run dev` — start the API with hot reload (`ts-node-dev`) on `PORT` (default 4000)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled build (`dist/server.js`)
- `npm run typecheck` — `tsc --noEmit`, no separate lint script exists

Requires a running MongoDB at `MONGO_URI` (see `backend/.env.example`). Copy it to `backend/.env` before running. The active provider's API key (`VENICE_API_KEY` / `OPENROUTER_API_KEY` / `DEEPINFRA_API_KEY`) is only needed to actually hit the LLM; without it, everything except `POST /api/v1/conversations/:id/messages` works.

## Architecture

**Modular monolith**, one Node process, with each domain module following the same 4-layer pattern:

```
routes.ts → controller.ts → service.ts → repository.ts → Mongoose model.ts
```

- **routes**: wires Express paths to controller methods, applies `validateBody(zodSchema)`
- **controller**: thin — extracts req data, calls service, shapes HTTP response
- **service**: business logic, orchestrates repositories/other modules, throws `ApiError` for domain errors
- **repository**: only place that touches Mongoose models directly

Modules live under `src/modules/`: `characters`, `worlds`, `conversations` (owns both `Conversation` and `Message` models), `llm`, `context`.

### The message-send flow (the core of the app)

`POST /api/v1/conversations/:id/messages` → `conversation.controller` → `conversation.service.sendMessage()`, which:
1. loads the conversation, its character, and its world (if any) via their repositories
2. loads recent messages via `messageRepository`
3. calls `contextBuilder.build()` (in `src/modules/context/`) to turn character + world + recent messages + the new user message into an `LLMRequest`
4. calls `llmGateway.generate()` (in `src/modules/llm/`) to get a response
5. persists both the user message and assistant message, returns the assistant message + token usage

**Never call a provider (Venice) directly from a business module.** Business logic (`conversations`, `characters`, `worlds`, `context`) must only ever go through `llmGateway` → `modelRouter` → an `LLMProvider` implementation (`src/modules/llm/providers/`). This indirection is the whole point of the architecture — it's what lets the LLM provider be swapped later without touching character/world/conversation/context code. `modelRouter.resolve()` is currently a stub that always returns `VeniceProvider`; when multi-model support is added, that's the only place that should change.

### Context building

`contextBuilder.build()` (`src/modules/context/context.builder.ts`) does NOT send full conversation history — it windows to the last `RECENT_MESSAGE_LIMIT` (20) messages. There's no summarization or long-term memory yet (that's the Phase 2/3 Memory System from the doc); the window is a fixed message count, not a token budget. `promptManager.buildSystemPrompt()` (`prompt.manager.ts`) turns a character + world + current scene into the system prompt text.

### Error handling

Services throw `ApiError` (`src/utils/api-error.ts`) for expected failures (404/400). Route handlers are wrapped in `asyncHandler` (`src/utils/async-handler.ts`) so rejected promises reach `errorMiddleware` (`src/middleware/error.middleware.ts`), which also formats `ZodError`s from body validation into 400s. Unknown errors become a generic 500 and are logged via `pino`, never leaked to the client.

### Venice provider

`VeniceProvider` (`src/modules/llm/providers/venice.provider.ts`) calls Venice's OpenAI-compatible `/chat/completions` endpoint directly via `fetch`, with a 30s timeout and retry-with-backoff (up to 2 retries) on 429/5xx/timeout. Raw provider errors are never returned to clients — they're normalized to a 502 `ApiError`.
