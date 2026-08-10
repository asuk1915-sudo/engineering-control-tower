import type { DimensionKey, TeamSignal } from "@/data/portfolio";
import { dimensions } from "@/data/portfolio";

export type HealthStatus = "Strong" | "Stable" | "Watch" | "Intervention";

export type HealthResult = {
  baseScore: number;
  finalScore: number;
  status: HealthStatus;
  confidence: "High" | "Medium" | "Low";
  rules: string[];
  drivers: Array<{ key: DimensionKey; label: string; score: number; impact: number }>;
  actions: string[];
};

const actions: Record<DimensionKey, string> = {
  outcomes: "Reconfirm the two outcomes that define value for this planning window.",
  predictability: "Reduce work in progress and re-sequence commitments around the constrained team.",
  quality: "Fund defect prevention on the highest-change service before adding scope.",
  reliability: "Close the resilience gap and verify recovery evidence in the next review.",
  security: "Assign one accountable owner to the critical security exposure and date the evidence.",
  sustainability: "Protect team capacity by removing unplanned work and stabilizing on-call load.",
};

export function healthStatus(score: number): HealthStatus {
  if (score >= 80) return "Strong";
  if (score >= 70) return "Stable";
  if (score >= 60) return "Watch";
  return "Intervention";
}

export function calculateHealth(team: TeamSignal): HealthResult {
  const baseScore = Math.round(
    dimensions.reduce((total, dimension) => total + team.metrics[dimension.key] * dimension.weight, 0),
  );

  let finalScore = baseScore;
  const rules: string[] = [];

  if (team.staleEvidenceDays > 14) {
    finalScore -= 5;
    rules.push("Evidence older than 14 days: −5 confidence penalty");
  }
  if (team.missingOwner) {
    finalScore = Math.min(finalScore, 69);
    rules.push("Material risk has no accountable owner: score capped at 69");
  }
  if (team.overdueCriticalVulnerability) {
    finalScore = Math.min(finalScore, 64);
    rules.push("Critical security exposure is overdue: score capped at 64");
  }
  if (team.criticalIncident) {
    finalScore = Math.min(finalScore, 59);
    rules.push("Unresolved critical production incident: score capped at 59");
  }

  finalScore = Math.max(0, Math.round(finalScore));
  const drivers = dimensions
    .map((dimension) => ({
      key: dimension.key,
      label: dimension.label,
      score: team.metrics[dimension.key],
      impact: Math.round((80 - team.metrics[dimension.key]) * dimension.weight * 10) / 10,
    }))
    .toSorted((a, b) => b.impact - a.impact);

  const confidence = team.staleEvidenceDays > 14 ? "Low" : team.staleEvidenceDays > 7 ? "Medium" : "High";

  return {
    baseScore,
    finalScore,
    status: healthStatus(finalScore),
    confidence,
    rules,
    drivers,
    actions: drivers.slice(0, 2).map((driver) => actions[driver.key]),
  };
}

export function averageHealth(teams: TeamSignal[]) {
  if (teams.length === 0) return 0;
  return Math.round(teams.reduce((total, team) => total + calculateHealth(team).finalScore, 0) / teams.length);
}
