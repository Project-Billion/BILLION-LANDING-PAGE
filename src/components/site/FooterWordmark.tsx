/**
 * Ghosted "billion" wordmark behind the footer (design spec section 10). Static and
 * decorative: no scroll binding, unlike the hero's old watermark it replaces. Sits
 * outside Container so it spans the full width; Footer clips it with overflow-hidden
 * and this element's own transform pushes about a third of it past the page's bottom edge.
 */
export function FooterWordmark() {
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none w-full translate-y-[35%] text-center leading-[0.8] font-medium whitespace-nowrap select-none"
      style={{ fontSize: "clamp(6rem, 22vw, 20rem)", color: "rgba(255, 255, 255, 0.05)" }}
    >
      billion
    </p>
  );
}
