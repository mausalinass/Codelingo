import { apiClient } from "./client";
import type { EvaluateRequest, EvaluateResponse } from "../types/api";
import { evaluateMockExercise } from "./mockData";

export async function evaluateExercise(req: EvaluateRequest): Promise<EvaluateResponse> {
  try {
    return await apiClient<EvaluateResponse>("/api/evaluate", {
      method: "POST",
      body: JSON.stringify(req),
    });
  } catch (err) {
    console.warn("Backend unavailable for evaluate; running mock evaluator:", err);
    // Simulate short network delay (~300ms) for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 300));
    return evaluateMockExercise(req);
  }
}
