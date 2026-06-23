// Static-render stub for next/navigation. The real hooks read Next's App Router
// context, which doesn't exist in the headless preview render, so they throw.
// This returns inert values so components using usePathname/useRouter (Header,
// CommandBar, and next-intl's @/locales/navigation) render their final visual
// state instead of crashing. Navigation is a no-op in a static card.
export function usePathname() {
  return "/";
}
export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
}
export class ReadonlyURLSearchParams extends URLSearchParams {}
export function useSearchParams() {
  return new ReadonlyURLSearchParams();
}
export function useParams() {
  return { lang: "en" };
}
export function useSelectedLayoutSegment() {
  return null;
}
export function useSelectedLayoutSegments() {
  return [];
}
export function redirect() {}
export function permanentRedirect() {}
export function notFound() {}
export function useServerInsertedHTML() {}
export const RedirectType = { push: "push", replace: "replace" };
