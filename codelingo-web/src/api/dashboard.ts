import { apiClient } from "./client";
import { previewCourses, previewStreak } from "./preview";
import type { DashboardResponse } from "../types/api";
export async function fetchDashboard(userId: string): Promise<DashboardResponse> {
 const dashboard = await apiClient<DashboardResponse>(`/api/users/${userId}/dashboard`);
 const localStreak = previewStreak();
 return {...dashboard, streak: localStreak.current > dashboard.streak.current ? localStreak : dashboard.streak, courses: [...dashboard.courses, ...previewCourses()]};
}
