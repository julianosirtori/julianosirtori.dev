"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { excludedPath, safePath, track } from "@/lib/analytics";
const ID = "G-VNFLVEVSCC";
export function SiteAnalytics() {
  const pathname = usePathname();
  const last = useRef("");
  const enabled =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    !excludedPath(pathname);
  useEffect(() => {
    Object.assign(window, { [`ga-disable-${ID}`]: !enabled });
    if (!enabled) {
      last.current = "";
      return;
    }
    window.dataLayer ||= [];
    if (!window.gtag) {
      window.gtag = function () {
        // gtag's queue protocol uses Arguments objects.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: window.location.origin + safePath(pathname),
        page_referrer: "",
      });
    }
    window.gtag("set", {
      page_location: window.location.origin + safePath(pathname),
      page_referrer: "",
    });
    if (last.current !== pathname) {
      last.current = pathname;
      track("page_view");
    }
  }, [enabled, pathname]);
  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.("a");
      if (!anchor) return;
      const location = anchor.closest("footer")
        ? "footer"
        : anchor.closest("header")
          ? "header"
          : "content";
      const url = new URL(anchor.href, window.location.origin);
      if (url.pathname === "/Juliano_Sirtori_Resume.pdf")
        track("cv_download_click", { location, content_id: "cv" });
      else if (anchor.dataset.project)
        track("project_click", {
          location,
          content_id: anchor.dataset.project,
        });
      else if (
        [
          "github.com",
          "www.linkedin.com",
          "linkedin.com",
          "discord.gg",
          "twitter.com",
          "x.com",
        ].includes(url.hostname)
      )
        track("social_click", {
          location,
          action_id: url.hostname.replaceAll(".", "_"),
        });
      else if (url.origin === window.location.origin) {
        const destination =
          safePath(url.pathname).split("/").slice(2).join("_") || "home";
        track(
          url.pathname.endsWith("/work-with-me")
            ? "cta_click"
            : "navigation_click",
          { location, action_id: destination },
        );
      }
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [enabled]);
  if (!enabled) return null;
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
      strategy="afterInteractive"
    />
  );
}
export function ArticleAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    const article = document.getElementById("post-content");
    if (!article) return;
    track("article_view", { content_id: slug, location: "article" });
    const sent = new Set<number>();
    let visibleMs = 0;
    let last = performance.now();
    let completed = false;
    const update = () => {
      const now = performance.now();
      if (document.visibilityState === "visible")
        visibleMs += Math.min(now - last, 1500);
      last = now;
      const rect = article.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / rect.height),
      );
      if (document.visibilityState !== "visible") return;
      for (const milestone of [25, 50, 75, 100] as const)
        if (ratio * 100 >= milestone && !sent.has(milestone)) {
          sent.add(milestone);
          track("article_read_progress", {
            location: "article",
            content_id: slug,
            progress: milestone,
          });
        }
      if (!completed && ratio >= 1 && visibleMs >= 30_000) {
        completed = true;
        track("article_read_complete", {
          location: "article",
          content_id: slug,
        });
      }
    };
    const timer = setInterval(update, 1000);
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [slug]);
  return null;
}
