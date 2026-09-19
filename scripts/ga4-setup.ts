import "./env";
import { v1beta } from "@google-analytics/admin";
import {
  buildGa4Plan,
  desiredCustomDimensions,
  desiredCustomMetrics,
  desiredKeyEvents,
  type Ga4PlanItem,
} from "../src/lib/ga4-admin-config";

const HELP = `Usage: pnpm ga4:setup -- --property <numeric-id> [--apply]

Audits the GA4 property and prints the declarative setup plan as JSON.
It only creates missing resources when --apply is supplied. Existing resources
are never deleted or archived.

Options:
  --property <id>  Numeric GA4 Property ID (or set GA4_PROPERTY_ID)
  --apply          Create missing resources after a conflict-free audit
  --help           Show this help
`;

type Options = { propertyId: string; apply: boolean };

function parseOptions(argv: string[]): Options | null {
  if (argv.includes("--help") || argv.includes("-h")) return null;

  let propertyId = process.env.GA4_PROPERTY_ID ?? "";
  let apply = false;
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--") continue;
    if (argument === "--apply") apply = true;
    else if (argument === "--property") propertyId = argv[++index] ?? "";
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (!/^\d+$/.test(propertyId)) {
    throw new Error(
      "A numeric GA4 Property ID is required via --property or GA4_PROPERTY_ID.",
    );
  }
  return { propertyId, apply };
}

async function applyPlan(
  client: InstanceType<typeof v1beta.AnalyticsAdminServiceClient>,
  parent: string,
  plan: Ga4PlanItem[],
) {
  const created: Ga4PlanItem[] = [];
  for (const item of plan.filter(
    (candidate) => candidate.action === "create",
  )) {
    if (item.kind === "custom_dimension") {
      const definition = desiredCustomDimensions.find(
        (candidate) => candidate.parameterName === item.id,
      );
      if (!definition) throw new Error(`Unknown custom dimension: ${item.id}`);
      await client.createCustomDimension({
        parent,
        customDimension: definition,
      });
    } else if (item.kind === "custom_metric") {
      const definition = desiredCustomMetrics.find(
        (candidate) => candidate.parameterName === item.id,
      );
      if (!definition) throw new Error(`Unknown custom metric: ${item.id}`);
      await client.createCustomMetric({ parent, customMetric: definition });
    } else {
      const definition = desiredKeyEvents.find(
        (candidate) => candidate.eventName === item.id,
      );
      if (!definition) throw new Error(`Unknown key event: ${item.id}`);
      await client.createKeyEvent({ parent, keyEvent: definition });
    }
    created.push(item);
  }
  return created;
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  if (!options) {
    console.info(HELP);
    return;
  }

  const parent = `properties/${options.propertyId}`;
  const client = new v1beta.AnalyticsAdminServiceClient();
  try {
    const [[property], [customDimensions], [customMetrics], [keyEvents]] =
      await Promise.all([
        client.getProperty({ name: parent }),
        client.listCustomDimensions({ parent }),
        client.listCustomMetrics({ parent }),
        client.listKeyEvents({ parent }),
      ]);

    const plan = buildGa4Plan({ customDimensions, customMetrics, keyEvents });
    const conflicts = plan.filter((item) => item.action === "conflict");
    const report = {
      mode: options.apply ? "apply" : "audit",
      property: {
        id: options.propertyId,
        displayName: property.displayName ?? null,
      },
      summary: {
        present: plan.filter((item) => item.action === "present").length,
        create: plan.filter((item) => item.action === "create").length,
        conflicts: conflicts.length,
      },
      plan,
    };

    if (!options.apply) {
      console.info(JSON.stringify(report, null, 2));
      if (conflicts.length) process.exitCode = 2;
      return;
    }
    if (conflicts.length) {
      console.info(JSON.stringify(report, null, 2));
      throw new Error("Apply aborted because the audit found conflicts.");
    }

    const created = await applyPlan(client, parent, plan);
    console.info(
      JSON.stringify(
        {
          ...report,
          summary: { ...report.summary, created: created.length },
          created: created.map(({ kind, id }) => ({ kind, id })),
        },
        null,
        2,
      ),
    );
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`GA4 setup failed: ${message}`);
  process.exitCode = 1;
});
