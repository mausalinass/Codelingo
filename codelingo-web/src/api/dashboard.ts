import { apiClient } from "./client";
import type { DashboardResponse } from "../types/api";
export const fetchDashboard = (userId: string) => apiClient<DashboardResponse>(`/api/users/${userId}/dashboard`);
