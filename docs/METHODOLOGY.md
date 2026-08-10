# Explainable Engineering Health Methodology

## Weighted base score

For each team:

```text
Base health =
  outcome confidence × 0.25
+ delivery predictability × 0.20
+ quality × 0.15
+ reliability × 0.15
+ security readiness × 0.15
+ capacity sustainability × 0.10
```

Every input is normalized to 0–100. Program and portfolio scores are transparent averages of the relevant team results in V1.

## Status thresholds

| Score | Status | Operating meaning |
| ---: | --- | --- |
| 80–100 | Strong | Protect flow and avoid unnecessary intervention |
| 70–79 | Stable | Outcome remains credible; monitor leading indicators |
| 60–69 | Watch | Leadership attention and a dated action are required |
| 0–59 | Intervention | System-level intervention is required now |

## Hard governance rules

Weighted averages can hide critical conditions, so explicit rules are applied:

- Unresolved critical production incident: final score capped at **59**
- Overdue critical security exposure: final score capped at **64**
- Material risk without an accountable owner: final score capped at **69**
- Evidence older than 14 days: **5-point** confidence penalty

The UI shows every activated rule.

## Driver calculation

Driver impact estimates the weighted distance from a healthy reference point of 80:

```text
Driver impact = (80 − dimension score) × dimension weight
```

The largest positive impacts become the top drivers. Recommended actions are deterministic mappings to the weakest dimensions, keeping the no-key demo reproducible.

## Guardrails

- Scores evaluate delivery-system health, not individual performance.
- Metrics should be paired with qualitative context and an accountable decision.
- No decision should be automated solely from a composite score.
- Evidence lineage, freshness, and exceptions must remain visible.
- Thresholds and weights should be calibrated with the organization that uses them.
