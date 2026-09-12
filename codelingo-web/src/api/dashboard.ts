import { apiClient } from "./client";
import type { DashboardResponse } from "../types/api";
import { getMockDashboard } from "./mockData";

export async function fetchDashboard(userId: string): Promise<DashboardResponse> {
  try {
    return await apiClient<DashboardResponse>(`/api/users/${userId}/dashboard`);
  } catch (err) {
    console.warn("Backend unavailable for dashboard; serving mock dashboard data:", err);
    return getMockDashboard();
  }
}
