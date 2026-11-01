export type ProviderId = "groq" | "openrouter" | "openai" | "deepseek" | "mistral";

export type ProviderConfig = {
  id: ProviderId;
  baseUrl: string;
  apiKeys: string[];
  defaultModel: string;
};

function keys(singleName: string, pluralName: string): string[] {
  const values = [process.env[singleName], process.env[pluralName]]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(values)];
}

const configs: ProviderConfig[] = [
  { id: "groq", baseUrl: "https://api.groq.com/openai/v1", apiKeys: keys("GROQ_API_KEY", "GROQ_API_KEYS"), defaultModel: "llama-3.3-70b-versatile" },
  { id: "openrouter", baseUrl: "https://openrouter.ai/api/v1", apiKeys: keys("OPENROUTER_API_KEY", "OPENROUTER_API_KEYS"), defaultModel: "openai/gpt-4o-mini" },
  { id: "openai", baseUrl: "https://api.openai.com/v1", apiKeys: keys("OPENAI_API_KEY", "OPENAI_API_KEYS"), defaultModel: "gpt-4o-mini" },
  { id: "deepseek", baseUrl: "https://api.deepseek.com/v1", apiKeys: keys("DEEPSEEK_API_KEY", "DEEPSEEK_API_KEYS"), defaultModel: "deepseek-chat" },
  { id: "mistral", baseUrl: "https://api.mistral.ai/v1", apiKeys: keys("MISTRAL_API_KEY", "MISTRAL_API_KEYS"), defaultModel: "mistral-small-latest" },
];

export function getConfiguredProviders() {
  return configs.filter((provider) => provider.apiKeys.length > 0);
}

export function resolveProvider(model: string): { provider: ProviderConfig; model: string } | null {
  const slash = model.indexOf("/");
  if (slash > 0) {
    const prefix = model.slice(0, slash).toLowerCase() as ProviderId;
    const provider = configs.find((item) => item.id === prefix && item.apiKeys.length > 0);
    return provider ? { provider, model: model.slice(slash + 1) } : null;
  }
  const provider = configs.find((item) => item.apiKeys.length > 0);
  return provider ? { provider, model: model || provider.defaultModel } : null;
}

export function getFallbackProviders(exclude: ProviderId) {
  return configs.filter((provider) => provider.id !== exclude && provider.apiKeys.length > 0);
}
