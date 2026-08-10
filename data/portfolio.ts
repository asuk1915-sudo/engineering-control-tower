export type DimensionKey = "outcomes" | "predictability" | "quality" | "reliability" | "security" | "sustainability";

export const dimensions: Array<{ key: DimensionKey; label: string; weight: number; description: string }> = [
  { key: "outcomes", label: "Outcome confidence", weight: 0.25, description: "Evidence that committed customer and business outcomes remain achievable." },
  { key: "predictability", label: "Delivery predictability", weight: 0.2, description: "Flow, commitment reliability, aging work, and delivery variance." },
  { key: "quality", label: "Quality", weight: 0.15, description: "Escaped defects, change failure, test evidence, and rework pressure." },
  { key: "reliability", label: "Reliability", weight: 0.15, description: "Availability, incidents, recovery readiness, and operational risk." },
  { key: "security", label: "Security readiness", weight: 0.15, description: "Critical exposure, remediation age, control evidence, and ownership." },
  { key: "sustainability", label: "Capacity sustainability", weight: 0.1, description: "Unplanned work, on-call load, focus, and team capacity health." },
];

export type TeamSignal = {
  id: string;
  name: string;
  programId: string;
  lead: string;
  focus: string;
  metrics: Record<DimensionKey, number>;
  staleEvidenceDays: number;
  missingOwner?: boolean;
  overdueCriticalVulnerability?: boolean;
  criticalIncident?: boolean;
  wip: number;
  unplanned: number;
  trend: number;
};

export const programs = [
  { id: "atlas", name: "Atlas Payments", outcome: "Unified commercial payment orchestration", target: "Oct 18", investment: "$12.4M" },
  { id: "nova", name: "Nova Identity", outcome: "Zero-trust customer identity platform", target: "Sep 27", investment: "$8.7M" },
  { id: "pulse", name: "Pulse Experience", outcome: "Real-time servicing experience", target: "Nov 08", investment: "$6.2M" },
  { id: "orbit", name: "Orbit Foundations", outcome: "Multi-region cloud and developer platform", target: "Dec 13", investment: "$9.1M" },
] as const;

export const teams: TeamSignal[] = [
  { id: "payments-core", name: "Payments Core", programId: "atlas", lead: "Elena V.", focus: "Orchestration and settlement", metrics: { outcomes: 68, predictability: 57, quality: 66, reliability: 72, security: 63, sustainability: 54 }, staleEvidenceDays: 5, wip: 19, unplanned: 31, trend: -4 },
  { id: "ledger", name: "Ledger Services", programId: "atlas", lead: "Marcus T.", focus: "Financial posting and reconciliation", metrics: { outcomes: 74, predictability: 69, quality: 78, reliability: 81, security: 76, sustainability: 70 }, staleEvidenceDays: 3, wip: 12, unplanned: 18, trend: 2 },
  { id: "risk", name: "Risk Decisioning", programId: "atlas", lead: "Sofia D.", focus: "Fraud signals and policy", metrics: { outcomes: 63, predictability: 61, quality: 69, reliability: 76, security: 58, sustainability: 65 }, staleEvidenceDays: 9, overdueCriticalVulnerability: true, wip: 15, unplanned: 24, trend: -3 },
  { id: "merchant", name: "Merchant Enablement", programId: "atlas", lead: "Jon B.", focus: "Partner onboarding", metrics: { outcomes: 79, predictability: 73, quality: 75, reliability: 80, security: 81, sustainability: 72 }, staleEvidenceDays: 6, wip: 10, unplanned: 16, trend: 4 },
  { id: "identity", name: "Identity Platform", programId: "nova", lead: "Noah K.", focus: "Authentication and token services", metrics: { outcomes: 61, predictability: 52, quality: 64, reliability: 58, security: 60, sustainability: 49 }, staleEvidenceDays: 4, criticalIncident: true, wip: 22, unplanned: 38, trend: -8 },
  { id: "access", name: "Access Governance", programId: "nova", lead: "Priya N.", focus: "Policy and privileged access", metrics: { outcomes: 67, predictability: 64, quality: 73, reliability: 77, security: 62, sustainability: 69 }, staleEvidenceDays: 16, missingOwner: true, wip: 14, unplanned: 22, trend: -2 },
  { id: "trust", name: "Trust Engineering", programId: "nova", lead: "Amir R.", focus: "Identity proofing and consent", metrics: { outcomes: 72, predictability: 71, quality: 76, reliability: 79, security: 75, sustainability: 73 }, staleEvidenceDays: 7, wip: 11, unplanned: 17, trend: 3 },
  { id: "experience", name: "Customer Experience", programId: "pulse", lead: "Maya S.", focus: "Web and mobile journeys", metrics: { outcomes: 82, predictability: 74, quality: 70, reliability: 83, security: 79, sustainability: 68 }, staleEvidenceDays: 5, wip: 13, unplanned: 20, trend: 5 },
  { id: "profile", name: "Customer Profile", programId: "pulse", lead: "Owen T.", focus: "Profile and preference services", metrics: { outcomes: 76, predictability: 67, quality: 72, reliability: 75, security: 78, sustainability: 66 }, staleEvidenceDays: 8, wip: 14, unplanned: 19, trend: 1 },
  { id: "servicing", name: "Digital Servicing", programId: "pulse", lead: "Leah M.", focus: "Case and notification flows", metrics: { outcomes: 71, predictability: 63, quality: 68, reliability: 73, security: 74, sustainability: 62 }, staleEvidenceDays: 11, wip: 16, unplanned: 25, trend: -1 },
  { id: "cloud", name: "Cloud Foundations", programId: "orbit", lead: "Ava B.", focus: "Runtime, network, and resilience", metrics: { outcomes: 84, predictability: 81, quality: 82, reliability: 86, security: 84, sustainability: 77 }, staleEvidenceDays: 2, wip: 9, unplanned: 14, trend: 6 },
  { id: "developer", name: "Developer Platform", programId: "orbit", lead: "Diego L.", focus: "CI/CD and engineering experience", metrics: { outcomes: 80, predictability: 77, quality: 85, reliability: 82, security: 83, sustainability: 75 }, staleEvidenceDays: 4, wip: 10, unplanned: 15, trend: 4 },
];

export const decisions = [
  { id: "DEC-204", urgency: "Today", title: "Protect Identity Platform recovery capacity", owner: "CTO staff", impact: "Unblocks 3 programs", evidence: "Critical incident + 38% unplanned work", programId: "nova" },
  { id: "DEC-198", urgency: "48 hours", title: "Resolve Risk Decisioning security exception", owner: "CISO delegate", impact: "Protects Atlas target", evidence: "Critical exposure overdue 9 days", programId: "atlas" },
  { id: "DEC-211", urgency: "This week", title: "Reduce Payments Core work in progress", owner: "Atlas sponsor", impact: "Recovers 2–3 weeks", evidence: "19 active items + predictability 57", programId: "atlas" },
  { id: "DEC-216", urgency: "This week", title: "Confirm Access Governance risk owner", owner: "Nova sponsor", impact: "Closes accountability gap", evidence: "Material risk without owner", programId: "nova" },
  { id: "DEC-219", urgency: "Next review", title: "Fund Pulse quality prevention work", owner: "Pulse product lead", impact: "Reduces servicing rework", evidence: "Quality trend below outcome trend", programId: "pulse" },
];

export const constraints = [
  { name: "Identity Platform", type: "Shared service", demand: 94, capacity: 61, downstream: 7, move: "Freeze intake; swarm recovery and token-contract closure", programId: "nova" },
  { name: "Security review capacity", type: "Specialist queue", demand: 86, capacity: 68, downstream: 5, move: "Risk-tier reviews and reserve two critical-path slots", programId: "atlas" },
  { name: "Integration test environments", type: "Environment", demand: 79, capacity: 64, downstream: 4, move: "Sequence Atlas and Pulse windows; publish acceptance evidence", programId: "atlas" },
  { name: "Data contract decisions", type: "Decision latency", demand: 72, capacity: 65, downstream: 3, move: "Time-box architecture decisions to 48 hours", programId: "pulse" },
];

export const trend = [
  { label: "Jul 06", health: 73, confidence: 77, flow: 70 },
  { label: "Jul 13", health: 72, confidence: 75, flow: 69 },
  { label: "Jul 20", health: 70, confidence: 72, flow: 67 },
  { label: "Jul 27", health: 68, confidence: 70, flow: 65 },
  { label: "Aug 03", health: 67, confidence: 68, flow: 63 },
  { label: "Aug 10", health: 66, confidence: 66, flow: 62 },
];
