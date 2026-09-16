import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-2",
  accent: "bg-kiln text-paper hover:bg-kiln-hover",
  secondary: "border border-ink/25 bg-transparent text-ink hover:border-ink",
};

interface StyleProps {
  /** primary = solid Ink, accent = solid Kiln (WhatsApp only), secondary = hairline outline. */
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type AnchorProps = StyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof StyleProps> & { href: string };

type NativeButtonProps = StyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof StyleProps> & { href?: never };

export type ButtonProps = AnchorProps | NativeButtonProps;

function buttonClasses(variant: ButtonVariant, className: string): string {
  // min-h-12 = 48px tap target; rounded-sm = 4px (never a pill).
  return `btn inline-flex min-h-12 items-center justify-center gap-3 rounded-sm px-6 text-ui font-medium whitespace-nowrap ${variantClasses[variant]} ${className}`;
}

function isAnchor(props: ButtonProps): props is AnchorProps {
  return typeof props.href === "string";
}

/**
 * Rectangular action. Renders an <a> when `href` is given, otherwise a <button type="button">.
 * Focus ring comes from the global :focus-visible rule.
 */
export function Button(props: ButtonProps) {
  if (isAnchor(props)) {
    const { variant = "primary", className = "", children, ...anchorProps } = props;
    return (
      <a className={buttonClasses(variant, className)} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { variant = "primary", className = "", children, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={buttonClasses(variant, className)} {...buttonProps}>
      {children}
    </button>
  );
}
