# @aether/data-models

Shared TypeScript domain models and mock API contract for the Aether dashboard.

## Import

```ts
import {
  Probe,
  ProbeSummary,
  TelemetrySample,
  Kpi,
  PaginatedResponse,
  FilterParams,
  API_ENDPOINTS,
} from '@aether/data-models';
```

## Models

| Interface | Role |
|-----------|------|
| `Probe` | Full probe resource (detail view) |
| `ProbeSummary` | List row DTO (lighter than `Probe`) |
| `TelemetrySample` | Time-series point for a probe |
| `Kpi` | Dashboard aggregate tile |
| `PaginatedResponse<T>` | Standard list envelope (`items`, `total`, `offset`, `limit`, `hasMore`) |
| `FilterParams` | Shared query params (`offset`, `limit`, `sort`, `filter`, `search`) |

## Mock API contract

OpenAPI 3.1 spec: [`api/openapi.yaml`](./api/openapi.yaml)

JSON Schema mirror: [`schemas/models.schema.json`](./schemas/models.schema.json)

### Endpoints

| Method | Path | Query params | Response |
|--------|------|--------------|----------|
| `GET` | `/api/v1/probes` | `offset`, `limit`, `sort`, `filter`, `search` | `PaginatedResponse<ProbeSummary>` |
| `GET` | `/api/v1/probes/:id` | — | `Probe` |
| `GET` | `/api/v1/telemetry` | `probeId`, `from`, `to`, `offset`, `limit`, `sort` | `PaginatedResponse<TelemetrySample>` |
| `GET` | `/api/v1/kpis` | `category?` | `Kpi[]` |

### Pagination & filtering

- **offset** — zero-based, default `0`
- **limit** — page size, default `20`, max `100`
- **sort** — `field:asc` or `field:desc` (e.g. `name:asc`, `lastCheckAt:desc`)
- **filter** — URL-encoded JSON object, e.g. `{"status":"active","type":"HTTP"}`
- **search** — free text on probe name/target

### Example requests

```http
GET /api/v1/probes?offset=0&limit=20&sort=name:asc&filter={"status":"active"}
GET /api/v1/probes/probe-001
GET /api/v1/telemetry?probeId=probe-001&from=2026-09-17T00:00:00Z&to=2026-09-17T23:59:59Z&limit=50
GET /api/v1/kpis?category=probes
```

### Backend swap

Use `API_ENDPOINTS` constants in data-access services so only the HTTP adapter changes when replacing the mock with a real backend. Response DTOs must keep the same JSON shape as defined here.
