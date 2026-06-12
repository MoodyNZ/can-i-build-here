import { MAX_COVERAGE_RATIO } from "@/lib/geometry";

/** Maximum site coverage expressed as a whole percentage for display. */
export const MAX_COVERAGE_PERCENT = Math.round(MAX_COVERAGE_RATIO * 100);

/** Shared locale-aware number formatter for figures shown to the user. */
export const numberFormat = new Intl.NumberFormat("en-NZ");
