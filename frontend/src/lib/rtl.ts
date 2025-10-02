// import { useLocale } from "next-intl";

export function useRTL() {
  // const locale = useLocale();
  // Default to LTR for now
  return false;
}

export function getDirection(locale: string) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRTL(locale: string) {
  return locale === "ar";
}
