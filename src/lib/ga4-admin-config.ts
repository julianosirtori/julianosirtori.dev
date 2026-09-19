export type Ga4ResourceKind =
  | "custom_dimension"
  | "custom_metric"
  | "key_event";

export type Ga4PlanAction = "create" | "present" | "conflict";

export type Ga4PlanItem = {
  kind: Ga4ResourceKind;
  id: string;
  action: Ga4PlanAction;
  reason?: string;
};

export const desiredCustomDimensions = [
  "language",
  "route",
  "location",
  "content_id",
  "action_id",
  "result",
  "progress",
  "target_language",
  "theme",
  "active",
].map((parameterName) => ({
  parameterName,
  displayName: parameterName,
  description: `Event parameter emitted by julianosirtori.dev: ${parameterName}`,
  scope: "EVENT" as const,
}));

export const desiredCustomMetrics = [
  {
    parameterName: "result_count",
    displayName: "result_count",
    description: "Bounded result count emitted by julianosirtori.dev",
    scope: "EVENT" as const,
    measurementUnit: "STANDARD" as const,
  },
];

export const desiredKeyEvents = ["newsletter_confirmed", "generate_lead"].map(
  (eventName) => ({ eventName, countingMethod: "ONCE_PER_EVENT" as const }),
);

export type CurrentGa4Config = {
  customDimensions: Array<{
    parameterName?: string | null;
    scope?: string | number | null;
  }>;
  customMetrics: Array<{
    parameterName?: string | null;
    scope?: string | number | null;
    measurementUnit?: string | number | null;
  }>;
  keyEvents: Array<{
    eventName?: string | null;
    countingMethod?: string | number | null;
  }>;
};

function enumMatches(
  actual: string | number | null | undefined,
  expectedName: string,
  expectedNumber: number,
) {
  return actual === expectedName || actual === expectedNumber;
}

export function buildGa4Plan(current: CurrentGa4Config): Ga4PlanItem[] {
  const plan: Ga4PlanItem[] = [];

  for (const desired of desiredCustomDimensions) {
    const existing = current.customDimensions.find(
      (item) => item.parameterName === desired.parameterName,
    );
    if (!existing) {
      plan.push({
        kind: "custom_dimension",
        id: desired.parameterName,
        action: "create",
      });
    } else if (!enumMatches(existing.scope, desired.scope, 1)) {
      plan.push({
        kind: "custom_dimension",
        id: desired.parameterName,
        action: "conflict",
        reason: "already exists with a scope other than EVENT",
      });
    } else {
      plan.push({
        kind: "custom_dimension",
        id: desired.parameterName,
        action: "present",
      });
    }
  }

  for (const desired of desiredCustomMetrics) {
    const existing = current.customMetrics.find(
      (item) => item.parameterName === desired.parameterName,
    );
    if (!existing) {
      plan.push({
        kind: "custom_metric",
        id: desired.parameterName,
        action: "create",
      });
    } else if (
      !enumMatches(existing.scope, desired.scope, 1) ||
      !enumMatches(existing.measurementUnit, desired.measurementUnit, 1)
    ) {
      plan.push({
        kind: "custom_metric",
        id: desired.parameterName,
        action: "conflict",
        reason: "already exists without EVENT scope and STANDARD unit",
      });
    } else {
      plan.push({
        kind: "custom_metric",
        id: desired.parameterName,
        action: "present",
      });
    }
  }

  for (const desired of desiredKeyEvents) {
    const existing = current.keyEvents.find(
      (item) => item.eventName === desired.eventName,
    );
    if (!existing) {
      plan.push({
        kind: "key_event",
        id: desired.eventName,
        action: "create",
      });
    } else if (
      !enumMatches(existing.countingMethod, desired.countingMethod, 1)
    ) {
      plan.push({
        kind: "key_event",
        id: desired.eventName,
        action: "conflict",
        reason:
          "already exists with a counting method other than ONCE_PER_EVENT",
      });
    } else {
      plan.push({
        kind: "key_event",
        id: desired.eventName,
        action: "present",
      });
    }
  }

  return plan;
}
