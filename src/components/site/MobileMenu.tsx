"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { nav, newTabHint, whatsappUrl } from "@/content/site";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Full-height sheet menu for viewports under 768px.
 * Traps focus between the toggle and the sheet, closes on Escape, link click,
 * or when the viewport grows to desktop, and locks body scroll while open.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const trapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    trapRef.current?.querySelector<HTMLElement>(`#${CSS.escape(sheetId)} a[href]`)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !trapRef.current) return;

      const focusables = Array.from(trapRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open, close, sheetId]);

  return (
    <div ref={trapRef} className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label={open ? nav.menuCloseLabel : nav.menuOpenLabel}
        onClick={() => setOpen((value) => !value)}
        className="btn relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-3 font-mono text-meta uppercase text-ink"
      >
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
      </button>

      <div
        id={sheetId}
        data-open={open}
        aria-hidden={!open}
        className="nav-sheet fixed inset-x-0 top-0 z-0 flex h-dvh flex-col overscroll-contain bg-paper px-5 pt-[calc(var(--nav-height)+3rem+env(safe-area-inset-top,0px))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <ul className="flex flex-col border-t border-rule">
          {nav.links.map((link) => (
            <li key={link.href} className="border-b border-rule">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-16 items-center font-display text-[2rem] leading-none tracking-[-0.02em] text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Button
          href={whatsappUrl()}
          variant="accent"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full"
          onClick={() => setOpen(false)}
        >
          {nav.whatsappLabel}
          <span className="sr-only">{newTabHint}</span>
        </Button>
      </div>
    </div>
  );
}
