export type ProbeStatus = 'active' | 'warning' | 'error' | 'inactive';

export type ProbeType = 'HTTP' | 'TCP' | 'DNS' | 'DB' | 'ICMP';

/** Full probe resource returned by GET /probes/:id */
export interface Probe {
  id: string;
  name: string;
  status: ProbeStatus;
  type: ProbeType;
  /** Target URL, hostname, or connection string under monitoring */
  target: string;
  region: string;
  intervalSec: number;
  timeoutSec: number;
  /** ISO 8601 timestamp of the most recent check */
  lastCheckAt: string;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight row DTO used in paginated probe lists */
export interface ProbeSummary {
  id: string;
  name: string;
  status: ProbeStatus;
  type: ProbeType;
  region?: string;
  lastCheckAt?: string;
}
