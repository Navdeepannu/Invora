/**
 * Fixed document layout for invoice export.
 * Export output NEVER depends on viewport; it always uses these dimensions.
 */

/** A4 at 96 DPI (standard screen). Used as the canonical export layout. */
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/**
 * Scale factor to apply to the fixed document so the preview fits the UI.
 * Preview should render the same layout scaled by this (or by a responsive variant).
 */
export const PREVIEW_SCALE_FACTOR = 0.85;
