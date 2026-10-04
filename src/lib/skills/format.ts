/**
 * File sizes for the skill's file list. Below 1 kB the size is shown in bytes,
 * so a tiny file reads "38 B" instead of "0.0 kB". The unit symbol is fixed
 * because Intl spells bytes differently per locale ("byte", "bytes").
 */
export function formatFileSize(bytes: number, locale: string): string {
  const tag = locale === "pt" ? "pt-BR" : "en-US";
  if (bytes < 1000) {
    return `${new Intl.NumberFormat(tag).format(Math.max(0, Math.round(bytes)))} B`;
  }
  return new Intl.NumberFormat(tag, {
    style: "unit",
    unit: "kilobyte",
    unitDisplay: "short",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(bytes / 1000);
}
