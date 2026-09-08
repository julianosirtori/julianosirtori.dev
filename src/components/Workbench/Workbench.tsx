"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowTopRightIcon,
  BarChartIcon,
  CheckIcon,
  DesktopIcon,
  MobileIcon,
} from "@radix-ui/react-icons";

import { Link } from "@/locales/navigation";
import styles from "./Workbench.module.css";

const views = [
  { id: "web", Icon: DesktopIcon },
  { id: "mobile", Icon: MobileIcon },
  { id: "data", Icon: BarChartIcon },
] as const;

type View = (typeof views)[number]["id"];

// Illustrative datasets for the interface studies, not production metrics.
const orders = [
  { number: "1042", items: "twoItems", status: "new" },
  { number: "1041", items: "fourItems", status: "preparing" },
  { number: "1040", items: "oneItem", status: "ready" },
] as const;
const tasks = ["stock", "delivery", "prices"] as const;
const dailyOrders = [
  { day: "mon", count: 24 },
  { day: "tue", count: 18 },
  { day: "wed", count: 31 },
  { day: "thu", count: 22 },
  { day: "fri", count: 38 },
  { day: "sat", count: 29 },
  { day: "sun", count: 16 },
] as const;
const maxOrders = Math.max(...dailyOrders.map(({ count }) => count));

export function Workbench() {
  const t = useTranslations("home.workbench");
  const [view, setView] = useState<View>("web");

  return (
    <section id="craft" aria-labelledby="craft-title" className="scroll-mt-36">
      <p className="text-fg-subtle mb-5 font-mono text-xs tracking-[0.14em] uppercase">
        {t("label")}
      </p>
      <h2
        id="craft-title"
        className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {t("title")}
      </h2>

      <div className="mt-6">
        <div className={styles.stage} data-view={view} aria-hidden="true">
          <div className={`${styles.window} ${styles.browser}`}>
            <div className={styles.windowBar}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span>{t("preview.orders.window")}</span>
              <ArrowTopRightIcon width={11} height={11} />
            </div>
            <div className={styles.browserBody}>
              <div className={styles.browserContent}>
                <div className={styles.ordersHeading}>
                  <strong>{t("preview.orders.title")}</strong>
                  <span>{t("preview.today")}</span>
                </div>
                <div className={styles.orderColumns}>
                  <span>{t("preview.orders.order")}</span>
                  <span>{t("preview.orders.status")}</span>
                </div>
                {orders.map((order) => (
                  <div key={order.number} className={styles.orderRow}>
                    <span className={styles.orderNumber}>#{order.number}</span>
                    <span className={styles.orderItems}>
                      {t(`preview.orders.${order.items}`)}
                    </span>
                    <span
                      className={styles.orderStatus}
                      data-status={order.status}
                    >
                      <i />
                      {t(`preview.orders.${order.status}`)}
                    </span>
                  </div>
                ))}
                <div className={styles.browserFooter}>
                  <CheckIcon width={10} height={10} />
                  {t("preview.orders.updated")}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.window} ${styles.phone}`}>
            <div className={styles.phoneCamera} />
            <div className={styles.phoneBody}>
              <span className={styles.phoneTime}>09:41</span>
              <div className={styles.phoneHeading}>
                <span>{t("preview.today")}</span>
                <strong>{t("preview.tasks.title")}</strong>
              </div>
              <div className={styles.progress}>
                <span />
              </div>
              {tasks.map((task, index) => (
                <div key={task} className={styles.task} data-done={index < 2}>
                  <span className={styles.checkbox}>
                    {index < 2 && <CheckIcon width={9} height={9} />}
                  </span>
                  <span>{t(`preview.tasks.${task}`)}</span>
                </div>
              ))}
              <div className={styles.phoneFooter}>
                <CheckIcon width={9} height={9} />
                {t("preview.tasks.synced")}
              </div>
            </div>
            <div className={styles.phoneHome} />
          </div>

          <div className={`${styles.window} ${styles.data}`}>
            <div className={styles.windowBar}>
              <BarChartIcon width={12} height={12} />
              <span>{t("preview.data.file")}</span>
              <span>CSV</span>
            </div>
            <div className={styles.dataBody}>
              <div className={styles.dataRows}>
                <div className={styles.dataHeader}>
                  <span>{t("preview.data.day")}</span>
                  <span>{t("preview.orders.title")}</span>
                </div>
                {dailyOrders.slice(0, 3).map(({ day, count }) => (
                  <div key={day}>
                    <span>{t(`preview.days.${day}`)}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
              <div className={styles.bars}>
                {dailyOrders.map(({ day, count }) => (
                  <div key={day} className={styles.barColumn}>
                    <div className={styles.barTrack}>
                      <i style={{ height: `${(count / maxOrders) * 100}%` }} />
                    </div>
                    <span>{t(`preview.days.${day}`).slice(0, 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          role="group"
          aria-label={t("controlsLabel")}
          className="border-border flex justify-center gap-6 border-b sm:gap-8"
        >
          {views.map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              aria-controls="craft-caption"
              onClick={() => setView(id)}
              className="text-fg-muted hover:text-fg aria-pressed:border-fg aria-pressed:text-fg focus-visible:ring-accent -mb-px inline-flex min-h-12 items-center gap-2 border-b-2 border-transparent px-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
            >
              <Icon width={15} height={15} aria-hidden="true" />
              {t(`views.${id}.label`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <p
          id="craft-caption"
          aria-live="polite"
          aria-atomic="true"
          className="text-fg-muted min-h-[4.5em] max-w-[34ch] text-sm leading-relaxed"
        >
          {t(`views.${view}.description`)}
        </p>
        <Link
          href="/about#experience"
          className="group text-fg hover:text-accent focus-visible:ring-accent inline-flex shrink-0 items-center gap-1.5 rounded-sm py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("cta")}
          <ArrowTopRightIcon aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
