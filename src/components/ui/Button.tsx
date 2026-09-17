import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-fg text-bg",
  accent: "bg-kiln text-fg",
  secondary: "border border-rule bg-transparent text-fg",
};

interface StyleProps {
  /** primary = solid Fg, accent = solid Kiln (WhatsApp only), secondary = hairline outline. */
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
  // min-h-12 = 48px tap target; rounded-pill = fully rounded; hover is opacity only.
  return `btn inline-flex min-h-12 items-center justify-center gap-3 rounded-pill px-6 text-ui font-medium whitespace-nowrap hover:opacity-85 ${variantClasses[variant]} ${className}`;
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
