# API-FLOW

A multi-tenant, BYOK AI gateway. Developers connect their own provider credentials, generate one API-FLOW virtual key, and use a single OpenAI-compatible endpoint in supported applications.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth (email OTP + password)
- Supabase Postgres
- AES-256-GCM encrypted provider credentials
- Vercel Node.js route handlers

## Required environment variables

Set these in Vercel (Production, Preview and Development as appropriate), then redeploy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_OR_SECRET_KEY
PROVIDER_KEYS_ENCRYPTION_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
APP_URL=https://api-flow-rosy.vercel.app
```

Never expose the service-role/secret key or encryption secret through a `NEXT_PUBLIC_*` variable or commit them to Git.

Generate an encryption secret locally with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Authentication
1. Sign up with an email address.
2. Verify the one-time code sent by Supabase Auth.
3. Create a password.
4. Sign in using email and password.

Supabase Auth hashes and manages passwords; API-FLOW does not store plaintext passwords. Configure the Supabase Auth email template to include `{{ .Token }}` for OTP, and set the production Site URL and redirect allow-list.

## BYOK workflow
1. Add one or more provider keys in **Dashboard → Providers**.
2. Provider secrets are encrypted using AES-256-GCM before being stored in `provider_credentials`.
3. Generate an API-FLOW virtual key in **Dashboard → Virtual API keys**. Its plaintext is shown once; only its SHA-256 hash is stored.
4. Use the virtual key from a server-side application.

Supported provider IDs: `groq`, `openrouter`, `openai`, `deepseek`, `mistral`, `anthropic`, `google`.

## OpenAI-compatible API

Base URL:
```
https://api-flow-rosy.vercel.app/api/v1
```

Endpoint: `POST /chat/completions`

Headers:
```
Authorization: Bearer af_live_YOUR_VIRTUAL_KEY
Content-Type: application/json
```

Example:
```json
{
  "model": "groq/llama-3.3-70b-versatile",
  "messages": [{ "role": "user", "content": "Hello" }]
}
```

Use the provider prefix to select a preferred provider. If it fails with a retryable provider error, API-FLOW tries the other enabled credentials belonging to the same account. Other connected providers are then used as fallbacks with their configured default model. Never send provider secrets from a client-side/browser app.

Streaming chat completions are supported with `"stream": true` using Server-Sent Events. The gateway forwards the provider stream without buffering it and adds `x-api-flow-provider`, `x-api-flow-attempts`, `x-api-flow-fallback`, and `x-api-flow-latency-ms` response headers. Usage events record request metadata and time-to-first-response; streamed token totals are not yet collected. Richer model catalogs, provider-specific request translation, per-key quotas, and detailed billing remain planned.

## Security model
- Each virtual key is tied to one Supabase user and stored as a hash.
- Every provider credential query is scoped to the authenticated virtual key's owner.
- Provider secrets are AES-256-GCM encrypted at rest; the encryption secret exists only in the server environment.
- The provider credential table has RLS enabled and no direct anon/authenticated table grants; application access is server-side.
- Usage records store metadata only, not prompts or completions.

## Local development
Install dependencies, copy `.env.example` to `.env.local`, fill the required values, and run:
```bash
npm install
npm run dev
```
