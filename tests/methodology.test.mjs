import assert from "node:assert/strict";
import test from "node:test";

const weights = { outcomes: .25, predictability: .2, quality: .15, reliability: .15, security: .15, sustainability: .1 };

function calculate(metrics, rules = {}) {
  let score = Math.round(Object.entries(weights).reduce((sum, [key, weight]) => sum + metrics[key] * weight, 0));
  if (rules.staleEvidenceDays > 14) score -= 5;
  if (rules.missingOwner) score = Math.min(score, 69);
  if (rules.overdueCriticalVulnerability) score = Math.min(score, 64);
  if (rules.criticalIncident) score = Math.min(score, 59);
  return score;
}

test("weights sum to one", () => {
  assert.equal(Object.values(weights).reduce((sum, weight) => sum + weight, 0), 1);
});

test("critical incident cannot be hidden by a strong weighted average", () => {
  const metrics = { outcomes: 90, predictability: 90, quality: 90, reliability: 90, security: 90, sustainability: 90 };
  assert.equal(calculate(metrics, { criticalIncident: true }), 59);
});

test("multiple governance rules apply conservatively", () => {
  const metrics = { outcomes: 85, predictability: 82, quality: 84, reliability: 83, security: 80, sustainability: 81 };
  assert.equal(calculate(metrics, { staleEvidenceDays: 20, missingOwner: true, overdueCriticalVulnerability: true }), 64);
});
