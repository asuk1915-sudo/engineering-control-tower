# Information and Application Architecture

## Information architecture

1. **Executive view** — portfolio score, leadership posture, and immediate exposure
2. **Portfolio health** — program outcomes and weighted health
3. **System constraints** — shared bottlenecks, excess demand, and propagation
4. **Team signals** — comparable evidence with contextual drill-down
5. **Portfolio trend** — health, evidence confidence, and flow trajectory
6. **Decision intelligence** — accountable decisions and AI portfolio brief

## Application architecture

```mermaid
flowchart LR
  A["Synthetic portfolio evidence"] --> B["Typed data model"]
  B --> C["Explainable health engine"]
  C --> D["Server-rendered application shell"]
  D --> E["Interactive scope and team views"]
  C --> F["Deterministic executive brief"]
  E --> G["Vercel production deployment"]
  E --> H["Sites secondary deployment"]
```

## Enterprise evolution path

```mermaid
flowchart TB
  J["Planning and work systems"] --> N["Evidence normalization layer"]
  Q["Quality and test systems"] --> N
  S["Security and compliance systems"] --> N
  O["Cloud, incident, and observability systems"] --> N
  N --> M["Health and constraint model"]
  M --> C["Executive Control Tower"]
  C --> D["Decision records and interventions"]
  D --> V["Verification and learning loop"]
  V --> M
```

V1 intentionally uses static synthetic data. A future backend becomes useful only when evidence ingestion, history, access control, and decision persistence are introduced.
