import type { GeminiRequest, GeminiResponse } from '@/types/api';

export async function callGemini<T>(
  promptKey: GeminiRequest['promptKey'],
  variables: Record<string, string>
): Promise<T> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promptKey, variables } satisfies GeminiRequest),
  });

  const json: GeminiResponse<T> = await res.json();

  if (!res.ok || json.error || !json.data) {
    throw new Error(json.error ?? 'Unknown API error');
  }

  return json.data;
}
