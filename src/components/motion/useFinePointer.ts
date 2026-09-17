"use client";

import { useSyncExternalStore } from "react";

function subscribeFinePointer(onChange: () => void) {
  const query = window.matchMedia("(pointer: fine)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Keep pointer effects off during SSR and react to input-device changes. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}
