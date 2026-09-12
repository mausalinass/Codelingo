export function getStreakTier(days: number) {
  if (days >= 500) return { color: "#DB2777", label: "500+ day streak" };
  if (days >= 250) return { color: "#D97706", label: "250-499 day streak" };
  if (days >= 100) return { color: "#7C3AED", label: "100-249 day streak" };
  if (days >= 50) return { color: "#0284C7", label: "50-99 day streak" };
  if (days >= 1) return { color: "#F97316", label: "1-49 day streak" };
  return { color: "#64748B", label: "No active streak" };
}
