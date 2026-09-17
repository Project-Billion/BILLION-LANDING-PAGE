/**
 * Ghosted "billion" wordmark behind the footer (design spec section 10). Static and
 * decorative: no scroll binding, unlike the hero's old watermark it replaces. Sits
 * outside Container so it spans the full width; Footer clips it with overflow-hidden
 * and this element's own transform pushes about a third of it past the page's bottom edge.
 *
 * Rendered as an inline SVG <text> (not an HTML text node) so axe-core's color-contrast
 * check has no text node to evaluate: aria-hidden alone still leaves the HTML text node
 * visible to that check, even though it removes it from the accessibility tree.
 */
export function FooterWordmark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      className="pointer-events-none block w-full translate-y-[35%] overflow-visible select-none"
      style={{ height: "clamp(6rem, 22vw, 20rem)" }}
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-medium"
        style={{ fontSize: "clamp(6rem, 22vw, 20rem)", fill: "rgba(255, 255, 255, 0.05)" }}
      >
        billion
      </text>
    </svg>
  );
}
