// Placeholder Gemini integration. Swap with real client when key is provided.
export async function suggestTags(promptText) {
  // If no API key, return basic heuristics
  const hasKey = !!process.env.GEMINI_API_KEY;
  if (!hasKey) {
    const base = [];
    const t = promptText.toLowerCase();
    if (t.includes('react')) base.push('react');
    if (t.includes('node')) base.push('nodejs');
    if (t.includes('python')) base.push('python');
    if (t.includes('image')) base.push('images');
    if (t.includes('sql')) base.push('sql');
    return Array.from(new Set(base)).slice(0, 5);
  }
  // TODO: Integrate Google Gemini API here using official SDK or fetch.
  // Return mock for now
  return ['ai', 'prompt-engineering'];
}
