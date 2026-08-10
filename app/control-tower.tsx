"use client";

import { useMemo, useState } from "react";
import { constraints, decisions, dimensions, programs, teams, trend, type TeamSignal } from "@/data/portfolio";
import { averageHealth, calculateHealth, healthStatus } from "@/lib/scoring";

const navigation = [
  ["01", "Executive view", "overview"],
  ["02", "Portfolio health", "portfolio"],
  ["03", "System constraints", "constraints"],
  ["04", "Team signals", "teams"],
  ["05", "Trend", "trend"],
  ["06", "Decision brief", "brief"],
] as const;

function statusClass(status: string) {
  return `status status-${status.toLowerCase()}`;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="score-ring" style={{ "--score": score } as React.CSSProperties} aria-label={`${label}: ${score} out of 100`}>
      <div><strong>{score}</strong><span>/ 100</span></div>
    </div>
  );
}

function DimensionBars({ team }: { team: TeamSignal }) {
  return (
    <div className="dimension-bars">
      {dimensions.map((dimension) => (
        <div className="dimension-row" key={dimension.key}>
          <span>{dimension.label}</span>
          <div className="bar-track"><i style={{ width: `${team.metrics[dimension.key]}%` }} /></div>
          <b>{team.metrics[dimension.key]}</b>
        </div>
      ))}
    </div>
  );
}

export function ControlTower() {
  const [scope, setScope] = useState("all");
  const [selectedTeamId, setSelectedTeamId] = useState("identity");
  const [copied, setCopied] = useState(false);

  const scopedTeams = useMemo(
    () => scope === "all" ? teams : teams.filter((team) => team.programId === scope),
    [scope],
  );
  const scopedPrograms = useMemo(
    () => scope === "all" ? programs : programs.filter((program) => program.id === scope),
    [scope],
  );
  const selectedTeam = scopedTeams.find((team) => team.id === selectedTeamId) ?? scopedTeams[0] ?? teams[0];
  const selectedHealth = calculateHealth(selectedTeam);
  const portfolioScore = averageHealth(scopedTeams);
  const interventionTeams = scopedTeams.filter((team) => calculateHealth(team).finalScore < 60);
  const watchTeams = scopedTeams.filter((team) => {
    const score = calculateHealth(team).finalScore;
    return score >= 60 && score < 70;
  });
  const scopedDecisions = decisions.filter((decision) => scope === "all" || decision.programId === scope);
  const scopedConstraints = constraints.filter((constraint) => scope === "all" || constraint.programId === scope);
  const scopeName = scope === "all" ? "Northstar Engineering Portfolio" : programs.find((program) => program.id === scope)?.name ?? "Portfolio";

  const brief = `${scopeName} is operating at ${portfolioScore}/100 engineering health (${healthStatus(portfolioScore)}). ${interventionTeams.length} team${interventionTeams.length === 1 ? "" : "s"} require immediate intervention and ${watchTeams.length} are on watch. The current system constraint is ${scopedConstraints[0]?.name ?? "cross-team delivery capacity"}, where demand is ${scopedConstraints[0]?.demand ?? 0} against capacity of ${scopedConstraints[0]?.capacity ?? 0}. The highest-value decision is to ${scopedDecisions[0]?.title.toLowerCase() ?? "protect constrained capacity"}. Evidence is synthetic and the narrative is generated locally without an API key.`;

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="rail">
        <a className="brand" href="#overview" aria-label="Engineering Control Tower home">
          <span>ECT</span>
          <strong>Engineering<br />Control Tower</strong>
        </a>
        <p className="rail-label">Operating system / 03</p>
        <nav aria-label="Control tower sections">
          {navigation.map(([number, label, id]) => (
            <a href={`#${id}`} key={id}><span>{number}</span>{label}</a>
          ))}
        </nav>
        <div className="rail-footer"><span>Public demo</span><small>Synthetic data only</small></div>
      </aside>

      <main>
        <header className="topbar">
          <div><span className="pulse-dot" /> Portfolio signal refreshed <b>14:30 UTC</b></div>
          <label>Decision scope
            <select value={scope} onChange={(event) => setScope(event.target.value)} aria-label="Decision scope">
              <option value="all">All strategic programs</option>
              {programs.map((program) => <option value={program.id} key={program.id}>{program.name}</option>)}
            </select>
          </label>
        </header>

        <section className="hero" id="overview">
          <div className="hero-copy">
            <p className="section-kicker">Executive engineering command view</p>
            <h1>See portfolio health.<br /><em>Make the move.</em></h1>
            <p>Turn fragmented engineering signals into an explainable view of outcomes, system constraints, and the leadership decisions that change delivery performance.</p>
          </div>
          <div className="hero-score">
            <div className="score-heading"><span>Engineering health</span><b className={statusClass(healthStatus(portfolioScore))}>{healthStatus(portfolioScore)}</b></div>
            <ScoreRing score={portfolioScore} label="Engineering health" />
            <small>As of Aug 10, 2026 · evidence confidence 78%</small>
          </div>
          <div className="hero-posture">
            <span>Leadership posture</span>
            <h2>{interventionTeams.length > 0 ? "Intervene on the constraint before adding scope." : "Protect flow and hold the operating line."}</h2>
            <p>{scopedDecisions.length} decisions queued · {interventionTeams.length} immediate interventions · {watchTeams.length} teams on watch</p>
          </div>
        </section>

        <section className="summary-strip" aria-label="Portfolio summary">
          <article><span>Strategic programs</span><strong>{scopedPrograms.length}</strong><small>${Array.from(scopedPrograms).reduce<number>((sum, program) => sum + Number(program.investment.replace(/[$M]/g, "")), 0).toFixed(1)}M represented</small></article>
          <article><span>Engineering teams</span><strong>{scopedTeams.length}</strong><small>{scopedTeams.reduce((sum, team) => sum + team.wip, 0)} active work items</small></article>
          <article><span>Immediate intervention</span><strong>{interventionTeams.length}</strong><small>rule-based escalation</small></article>
          <article><span>System constraints</span><strong>{scopedConstraints.length}</strong><small>{scopedConstraints[0]?.downstream ?? 0} downstream outcomes exposed</small></article>
        </section>

        <section className="section-block" id="portfolio">
          <div className="section-heading">
            <div><p className="section-kicker">01 / Portfolio health</p><h2>Outcomes first. Evidence underneath.</h2></div>
            <p>Each program view combines six weighted health dimensions with explicit governance rules. The score guides inquiry; it does not replace leadership judgment.</p>
          </div>
          <div className="program-grid">
            {scopedPrograms.map((program) => {
              const programTeams = teams.filter((team) => team.programId === program.id);
              const score = averageHealth(programTeams);
              const weakest = dimensions.toSorted((a, b) => {
                const aValue = programTeams.reduce((sum, team) => sum + team.metrics[a.key], 0) / programTeams.length;
                const bValue = programTeams.reduce((sum, team) => sum + team.metrics[b.key], 0) / programTeams.length;
                return aValue - bValue;
              })[0];
              return (
                <article className="program-card" key={program.id}>
                  <div className="program-top"><span>{program.name}</span><b className={statusClass(healthStatus(score))}>{healthStatus(score)}</b></div>
                  <div className="program-score"><strong>{score}</strong><span>/100</span><i style={{ width: `${score}%` }} /></div>
                  <h3>{program.outcome}</h3>
                  <dl><div><dt>Target</dt><dd>{program.target}</dd></div><div><dt>Investment</dt><dd>{program.investment}</dd></div><div><dt>Teams</dt><dd>{programTeams.length}</dd></div></dl>
                  <p><span>Primary drag</span>{weakest.label}</p>
                </article>
              );
            })}
          </div>
          <details className="methodology">
            <summary>How engineering health is calculated <span>+</span></summary>
            <div className="methodology-grid">
              {dimensions.map((dimension) => <article key={dimension.key}><b>{Math.round(dimension.weight * 100)}%</b><h3>{dimension.label}</h3><p>{dimension.description}</p></article>)}
            </div>
            <p className="rule-note"><b>Hard rules:</b> unresolved critical incident caps health at 59 · overdue critical security exposure caps at 64 · material risk without an owner caps at 69 · evidence older than 14 days reduces score by 5.</p>
          </details>
        </section>

        <section className="section-block contrast" id="constraints">
          <div className="section-heading">
            <div><p className="section-kicker">02 / System constraints</p><h2>Find what limits the portfolio.</h2></div>
            <p>A control tower should reveal shared constraints before they appear as isolated team misses.</p>
          </div>
          <div className="constraint-layout">
            <div className="constraint-list">
              {scopedConstraints.map((constraint, index) => (
                <article key={constraint.name}>
                  <span className="constraint-number">0{index + 1}</span>
                  <div><small>{constraint.type}</small><h3>{constraint.name}</h3><p>{constraint.downstream} downstream outcomes</p></div>
                  <div className="demand-capacity"><span>Demand <b>{constraint.demand}</b></span><i><em style={{ width: `${constraint.demand}%` }} /><strong style={{ width: `${constraint.capacity}%` }} /></i><span>Capacity <b>{constraint.capacity}</b></span></div>
                  <p className="constraint-move"><span>Leadership move</span>{constraint.move}</p>
                </article>
              ))}
            </div>
            <aside className="constraint-callout">
              <span>Constraint of record</span>
              <strong>{scopedConstraints[0]?.name ?? "No critical constraint"}</strong>
              <p>{scopedConstraints[0] ? `${scopedConstraints[0].demand - scopedConstraints[0].capacity} points of excess demand are propagating across ${scopedConstraints[0].downstream} outcomes.` : "The selected scope is operating within current capacity."}</p>
              <div><b>72h</b><small>recommended verification window</small></div>
            </aside>
          </div>
        </section>

        <section className="section-block" id="teams">
          <div className="section-heading">
            <div><p className="section-kicker">03 / Team signals</p><h2>Comparable signals, contextual decisions.</h2></div>
            <p>Select a team to see its score, rule activations, top drivers, and recommended action.</p>
          </div>
          <div className="team-layout">
            <div className="team-table">
              <div className="team-header"><span>Team</span><span>Health</span><span>Flow</span><span>Unplanned</span><span>Trend</span></div>
              {scopedTeams.toSorted((a, b) => calculateHealth(a).finalScore - calculateHealth(b).finalScore).map((team) => {
                const health = calculateHealth(team);
                return (
                  <button className={selectedTeam.id === team.id ? "team-row selected" : "team-row"} onClick={() => setSelectedTeamId(team.id)} key={team.id}>
                    <span><b>{team.name}</b><small>{team.lead}</small></span>
                    <span><strong>{health.finalScore}</strong><small className={statusClass(health.status)}>{health.status}</small></span>
                    <span>{team.metrics.predictability}</span>
                    <span>{team.unplanned}%</span>
                    <span className={team.trend >= 0 ? "positive" : "negative"}>{team.trend > 0 ? "+" : ""}{team.trend}</span>
                  </button>
                );
              })}
            </div>
            <aside className="team-detail">
              <div className="detail-title"><div><span>Selected team</span><h3>{selectedTeam.name}</h3><p>{selectedTeam.focus}</p></div><strong>{selectedHealth.finalScore}</strong></div>
              <DimensionBars team={selectedTeam} />
              <div className="driver-box"><span>Top drivers</span>{selectedHealth.drivers.slice(0, 3).map((driver) => <p key={driver.key}><b>{driver.label}</b><em>{driver.score}</em></p>)}</div>
              {selectedHealth.rules.length > 0 && <div className="rules"><span>Governance rules activated</span>{selectedHealth.rules.map((rule) => <p key={rule}>{rule}</p>)}</div>}
              <div className="recommended"><span>Recommended action</span><strong>{selectedHealth.actions[0]}</strong><small>Owner: {selectedTeam.lead} · verify Aug 13</small></div>
            </aside>
          </div>
        </section>

        <section className="section-block trend-section" id="trend">
          <div className="section-heading">
            <div><p className="section-kicker">04 / Portfolio trend</p><h2>Health is falling faster than confidence.</h2></div>
            <p>The issue is not signal quality. The portfolio has enough evidence to act; constraint closure is lagging.</p>
          </div>
          <div className="trend-layout">
            <div className="trend-chart" role="img" aria-label="Six week engineering health, confidence, and flow trend">
              {trend.map((point) => <div className="week" key={point.label}><div className="columns"><i style={{ height: `${point.health}%` }} title={`Health ${point.health}`} /><i style={{ height: `${point.confidence}%` }} title={`Confidence ${point.confidence}`} /><i style={{ height: `${point.flow}%` }} title={`Flow ${point.flow}`} /></div><span>{point.label}</span></div>)}
            </div>
            <aside className="trend-summary">
              <span>6-week change</span><strong>−7</strong><p>engineering health points</p>
              <hr />
              <dl><div><dt>Health</dt><dd>66</dd></div><div><dt>Confidence</dt><dd>66</dd></div><div><dt>Flow</dt><dd>62</dd></div></dl>
              <div className="legend"><span><i />Health</span><span><i />Confidence</span><span><i />Flow</span></div>
            </aside>
          </div>
        </section>

        <section className="section-block decision-section" id="brief">
          <div className="section-heading">
            <div><p className="section-kicker">05 / Decision intelligence</p><h2>Make the next move explicit.</h2></div>
            <p>Every signal ends in a decision, accountable owner, expected impact, and verification window.</p>
          </div>
          <div className="decision-layout">
            <div className="decision-queue">
              {scopedDecisions.map((decision, index) => <article key={decision.id}><span>0{index + 1}</span><div><small>{decision.id} · {decision.urgency}</small><h3>{decision.title}</h3><p>{decision.evidence}</p></div><aside><b>{decision.impact}</b><small>{decision.owner}</small></aside></article>)}
            </div>
            <aside className="ai-brief">
              <div><span>AI portfolio brief</span><small>No API key · deterministic demo</small></div>
              <p className="brief-meta">TO: EXECUTIVE ENGINEERING FORUM<br />SCOPE: {scopeName.toUpperCase()}<br />WINDOW: NEXT 30 DAYS</p>
              <h3>Engineering intervention brief</h3>
              <p>{brief}</p>
              <ol><li><b>Intervene</b>{scopedDecisions[0]?.title ?? "Protect constrained capacity"}.</li><li><b>Protect</b>{scopedConstraints[0]?.name ?? "portfolio flow"} through the next evidence review.</li><li><b>Verify</b>Health and flow return above 70 before accepting additional scope.</li></ol>
              <button type="button" onClick={copyBrief}>{copied ? "Brief copied" : "Copy executive brief"}</button>
            </aside>
          </div>
        </section>

        <footer><div><strong>Engineering Control Tower</strong><span>Part of the Engineering Intelligence Lab</span></div><p>Public reference implementation · All organizations, programs, people, and data are fictional.</p><a href="#overview">Back to top ↑</a></footer>
      </main>
    </div>
  );
}
