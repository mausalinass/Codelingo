import { apiClient } from "./client";
import type { EvaluateRequest, EvaluateResponse } from "../types/api";
export const evaluateExercise = (request: EvaluateRequest) => apiClient<EvaluateResponse>("/api/evaluate", { method: "POST", body: JSON.stringify(request) });
