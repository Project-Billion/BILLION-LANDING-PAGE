import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page-width wrapper: 1280px max content width, 20px gutters on mobile, 40px from md up.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[calc(var(--container-page)+5rem)] px-5 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
