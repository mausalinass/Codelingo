import { apiClient } from "./client";
import { previewCourses } from "./preview";
import type { DashboardResponse } from "../types/api";
export async function fetchDashboard(userId: string): Promise<DashboardResponse> {
 const dashboard = await apiClient<DashboardResponse>(`/api/users/${userId}/dashboard`);
 return {...dashboard, courses: [...dashboard.courses, ...previewCourses()]};
}