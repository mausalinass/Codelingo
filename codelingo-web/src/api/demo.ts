import { apiClient } from "./client";
import type { PersonalityTrait, PersonalityResponse } from "../types/api";
// Public builds hide demo controls. Never put a production demo secret in VITE_* variables.
export const DEMO_CONTROLS_ENABLED = import.meta.env.DEV || import.meta.env.VITE_DEMO_CONTROLS === "true";
export const setDemoPersonality = (userId: string, primaryTrait: PersonalityTrait) =>
  apiClient<PersonalityResponse>(`/api/demo/users/${userId}/personality`, { method: "POST", body: JSON.stringify({ primaryTrait }) });
