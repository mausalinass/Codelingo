import { apiClient } from "./client";
import type { PersonalityResponse } from "../types/api";
import { getMockPersonality } from "./mockData";

export async function fetchPersonality(userId: string): Promise<PersonalityResponse> {
  try {
    return await apiClient<PersonalityResponse>(`/api/users/${userId}/personality`);
  } catch (err) {
    console.warn("Backend unavailable for personality; serving mock personality data:", err);
    return getMockPersonality();
  }
}
