import type { AnalysisReport } from "@/lib/analysis-types";

/** Calls the Gemini-backed /api/analyze endpoint (Netlify Function / server route). */
export async function analyzeImageViaApi(input: {
  imageDataUrl: string;
  note?: string | undefined;
}): Promise<AnalysisReport> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const text = await response.text();
  let payload: (Partial<AnalysisReport> & { error?: string }) | null = null;
  try {
    payload = JSON.parse(text) as Partial<AnalysisReport> & { error?: string };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // Surface the real reason instead of a generic message: gateway/proxy
    // failures (timeouts, payload limits) return HTML rather than JSON.
    const detail =
      payload?.error ||
      (text.trim().startsWith("<") ? "" : text.trim().slice(0, 200)) ||
      response.statusText;
    throw new Error(
      `Analysis failed (HTTP ${response.status}${detail ? `: ${detail}` : ""}). Please try again with a smaller photo.`,
    );
  }
  if (!payload || !payload.kind) {
    throw new Error("The analysis engine returned an unreadable report. Please retry.");
  }
  return payload as AnalysisReport;
}
