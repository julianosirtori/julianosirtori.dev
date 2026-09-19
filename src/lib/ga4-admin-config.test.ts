import { describe, expect, it } from "vitest";
import {
  buildGa4Plan,
  desiredCustomDimensions,
  desiredCustomMetrics,
  desiredKeyEvents,
} from "./ga4-admin-config";

describe("buildGa4Plan", () => {
  it("plans every absent GA4 resource for creation", () => {
    const plan = buildGa4Plan({
      customDimensions: [],
      customMetrics: [],
      keyEvents: [],
    });

    expect(plan).toHaveLength(
      desiredCustomDimensions.length +
        desiredCustomMetrics.length +
        desiredKeyEvents.length,
    );
    expect(plan.every((item) => item.action === "create")).toBe(true);
  });

  it("is idempotent when the desired resources already exist", () => {
    const plan = buildGa4Plan({
      customDimensions: desiredCustomDimensions.map(({ parameterName }) => ({
        parameterName,
        scope: 1,
      })),
      customMetrics: desiredCustomMetrics.map(({ parameterName }) => ({
        parameterName,
        scope: "EVENT",
        measurementUnit: "STANDARD",
      })),
      keyEvents: desiredKeyEvents.map(({ eventName }) => ({
        eventName,
        countingMethod: 1,
      })),
    });

    expect(plan.every((item) => item.action === "present")).toBe(true);
  });

  it("reports immutable or unsafe differences as conflicts", () => {
    const plan = buildGa4Plan({
      customDimensions: [{ parameterName: "route", scope: "USER" }],
      customMetrics: [
        {
          parameterName: "result_count",
          scope: "EVENT",
          measurementUnit: "SECONDS",
        },
      ],
      keyEvents: [
        { eventName: "generate_lead", countingMethod: "ONCE_PER_SESSION" },
      ],
    });

    expect(plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "route", action: "conflict" }),
        expect.objectContaining({ id: "result_count", action: "conflict" }),
        expect.objectContaining({ id: "generate_lead", action: "conflict" }),
      ]),
    );
  });
});
