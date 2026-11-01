# API-FLOW

A provider-agnostic AI API gateway with intelligent routing, provider failover, usage visibility, and an OpenAI-compatible interface.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Zod request validation
- Vercel-ready Node.js route handlers

## Local development

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set `API_FLOW_MASTER_KEY` to a long random secret.
4. Add at least one server-side provider key.
5. Run `npm install` and `npm run dev`.

## API

### Health

`GET /api/health`

Returns service status and the names of configured providers. It never returns provider credentials.

### Chat completions

`POST /api/v1/chat/completions`

Authenticate with `Authorization: Bearer <API_FLOW_MASTER_KEY>`. The request body follows the common OpenAI chat-completions shape.

Example:

```json
{
  "model": "groq/llama-3.3-70b-versatile",
  "messages": [{ "role": "user", "content": "Hello" }]
}
```

Supported model prefixes: `groq/`, `openrouter/`, `openai/`, `deepseek/`, `mistral/`. Without a prefix, the first configured provider is selected.

The initial gateway release supports non-streaming chat completions. If the selected provider is unavailable or rate-limited, the gateway attempts other configured providers using their default models. Streaming, per-user API keys, persistent usage records, and dashboard analytics are planned follow-up milestones.

## Security

- Provider keys are read only from server-side environment variables.
- The gateway rejects requests unless `API_FLOW_MASTER_KEY` is configured.
- Never commit `.env.local` or expose provider keys through `NEXT_PUBLIC_*` variables.
- Do not use one shared master key as a public production credential. Per-user keys and quotas must be implemented before opening access to customers.

## Design

Deep black and charcoal surfaces, crimson accents, restrained texture, and clear typography.
