import { apiClient } from "./client";
import { isPreviewTrack, evaluatePreview } from "./preview";
import type { EvaluateRequest, EvaluateResponse } from "../types/api";
export const evaluateExercise = async (request: EvaluateRequest) => isPreviewTrack(request.language) ? evaluatePreview(request) : apiClient<EvaluateResponse>("/api/evaluate", { method: "POST", body: JSON.stringify(request) });