export type ProviderId = "groq" | "openrouter" | "openai" | "deepseek" | "mistral";

type ProviderConfig = {
  id: ProviderId;
  baseUrl: string;
  apiKey?: string;
  defaultModel: string;
};

const configs: ProviderConfig[] = [
  { id: "groq", baseUrl: "https://api.groq.com/openai/v1", apiKey: process.env.GROQ_API_KEY, defaultModel: "llama-3.3-70b-versatile" },
  { id: "openrouter", baseUrl: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY, defaultModel: "openai/gpt-4o-mini" },
  { id: "openai", baseUrl: "https://api.openai.com/v1", apiKey: process.env.OPENAI_API_KEY, defaultModel: "gpt-4o-mini" },
  { id: "deepseek", baseUrl: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY, defaultModel: "deepseek-chat" },
  { id: "mistral", baseUrl: "https://api.mistral.ai/v1", apiKey: process.env.MISTRAL_API_KEY, defaultModel: "mistral-small-latest" },
];

export function getConfiguredProviders() {
  return configs.filter((provider) => Boolean(provider.apiKey));
}

export function resolveProvider(model: string): { provider: ProviderConfig; model: string } | null {
  const slash = model.indexOf("/");
  if (slash > 0) {
    const prefix = model.slice(0, slash).toLowerCase() as ProviderId;
    const provider = configs.find((item) => item.id === prefix && item.apiKey);
    return provider ? { provider, model: model.slice(slash + 1) } : null;
  }
  const provider = configs.find((item) => item.apiKey);
  return provider ? { provider, model: model || provider.defaultModel } : null;
}

export function getFallbackProviders(exclude: ProviderId) {
  return configs.filter((provider) => provider.id !== exclude && Boolean(provider.apiKey));
}