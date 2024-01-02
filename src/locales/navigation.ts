import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { config } from "./config";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(config);
