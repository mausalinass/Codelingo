import { apiClient } from "./client";
import type { PersonalityTrait } from "../types/api";
import { mockState } from "./mockData";

export interface DemoPersonalityPayload {
  personality: PersonalityTrait;
}

export async function setDemoPersonality(
  userId: string,
  personality: PersonalityTrait
): Promise<{ success: boolean; personality: PersonalityTrait }> {
  try {
    return await apiClient<{ success: boolean; personality: PersonalityTrait }>(
      `/api/demo/users/${userId}/personality`,
      {
        method: "POST",
        body: JSON.stringify({ personality }),
      }
    );
  } catch (err) {
    console.warn("Backend demo endpoint unavailable; updating client mock state:", err);
    mockState.personality = personality;
    return { success: true, personality };
  }
}
