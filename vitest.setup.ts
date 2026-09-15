import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Next.js enforces this boundary during builds; unit tests run in plain Node.
vi.mock("server-only", () => ({}));
