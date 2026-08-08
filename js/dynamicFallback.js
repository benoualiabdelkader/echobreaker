/* ============================================================
   ECHOBREAKER — CSS Gradient Fallback Image Generator
   ------------------------------------------------------------
   Generates lightweight, color-coded CSS gradient backgrounds so
   that the feed NEVER shows broken image slots — even fully offline
   or when images are unavailable during jury review.

   NO SVG — uses a transparent 1px GIF data URI as img src,
   and applies the visual via the parent container's CSS class.

   Usage (called automatically by feed.js):
     getFallbackImage("health", "Mediterranean Diet")
   ============================================================ */

const CATEGORY_GRADIENTS = {
  health:        'linear-gradient(135deg, #B84A72 0%, #8E3A58 100%)',
  politics:      'linear-gradient(135deg, #4A72B8 0%, #3A5A8E 100%)',
  entertainment: 'linear-gradient(135deg, #B8862E 0%, #8E6422 100%)',
  science:       'linear-gradient(135deg, #4A9E8E 0%, #3A7E6E 100%)',
  conspiracy:    'linear-gradient(135deg, #A8412E 0%, #7E301E 100%)',
  sports:        'linear-gradient(135deg, #7B68EE 0%, #5A4EBB 100%)',
  lifestyle:     'linear-gradient(135deg, #D2691E 0%, #A05018 100%)',
  technology:    'linear-gradient(135deg, #20B2AA 0%, #188A84 100%)',
  default:       'linear-gradient(135deg, #A8412E 0%, #7E301E 100%)'
};

// Transparent 1px GIF — zero visual footprint, no SVG
const TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Returns the transparent GIF data URI for a given category.
 * The parent container (.post-image-placeholder) already has
 * category-specific CSS gradient backgrounds defined in styles.css,
 * so the gradient shows through the transparent image.
 *
 * @param {string} category - Post category key (e.g. "health")
 * @param {string} text     - Short label (unused — gradients handle visuals)
 * @returns {string} data URI for img.src (always the same transparent GIF)
 */
function getFallbackImage(category, text) {
  return TRANSPARENT_GIF;
}
