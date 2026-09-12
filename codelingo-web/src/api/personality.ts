import { apiClient } from "./client";
import type { PersonalityResponse } from "../types/api";
export const fetchPersonality = (userId: string) => apiClient<PersonalityResponse>(`/api/users/${userId}/personality`);
