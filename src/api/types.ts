export type Role = "viewer" | "operator" | "superadmin";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  is_active: boolean;
}

export interface Project {
  id: number;
  name: string;
  ip: string;
  port: number;
  master_id: number;
  outstation_id: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type DerivedStatus = "CLOSED" | "OPEN" | "ERROR";

export interface TelemetryRecord {
  id: number;
  project: number;
  cycle_timestamp: string;
  derived_status: DerivedStatus;
  ia: number | null;
  ib: number | null;
  ic: number | null;
  i_neutral: number | null;
  ua: number | null;
  ub: number | null;
  uc: number | null;
  ur: number | null;
  us: number | null;
  ut: number | null;
  freq: number | null;
  pf: number | null;
  breaker_close: boolean | null;
  breaker_open: boolean | null;
}

export interface AnalogPoint {
  id: number;
  label: string;
  value: number;
  count_update: number;
  timestamp: string;
}

export interface BinaryPoint {
  id: number;
  label: string;
  value: boolean;
  count_update: number;
  timestamp: string;
}

export type ManeuverAction = "TRIP" | "CLOSE";

export type ManeuverResult =
  | "success"
  | "fail_guard"
  | "fail_tcp"
  | "fail_verify"
  | "fail_locked"
  | "fail_cooldown"
  | "fail_tunnel";

export interface ManeuverLog {
  id: number;
  user: number;
  project: number;
  action: ManeuverAction;
  pre_status: DerivedStatus | "";
  pre_snapshot: Record<string, unknown>;
  post_status: DerivedStatus | "";
  post_snapshot: Record<string, unknown> | null;
  result: ManeuverResult;
  error_message: string;
  tx_frame: string;
  rx_frame: string;
  timestamp: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type TelemetryWsEvent =
  | ({ type: "telemetry.update"; project_id: number } & Partial<TelemetryRecord>)
  | {
      type: "maneuver.complete";
      project_id: number;
      result: ManeuverResult;
      by: string;
      post_status: DerivedStatus;
    }
  | { type: "device.offline"; project_id: number; reason: string };

