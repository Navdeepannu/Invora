/**
 * Fixed document layout for invoice export.
 * Export output NEVER depends on viewport; it always uses these dimensions.
 */

/** A4 at 96 DPI (standard screen). Used as the canonical export layout. */
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/** A4 in mm (for @react-pdf/renderer and PDF specs). */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

/**
 * Scale factor to apply to the fixed document so the preview fits the UI.
 * Preview should render the same layout scaled by this (or by a responsive variant).
 */
export const PREVIEW_SCALE_FACTOR = 0.85;

/** Document content width (with margins). Approx 90% of page width. */
export const DOC_CONTENT_WIDTH_PX = Math.round(A4_WIDTH_PX * 0.9);
export const DOC_CONTENT_WIDTH_MM = A4_WIDTH_MM * 0.9;

/** Margins in mm for react-pdf. */
export const PAGE_MARGIN_MM = 20;
