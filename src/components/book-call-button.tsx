import type { ButtonHTMLAttributes } from "react";
import { openCalendlyPopup } from "@/lib/calendly";

type BookCallButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function BookCallButton({ children, onClick, type = "button", ...props }: BookCallButtonProps) {
  return (
    <button
      type={type}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        void openCalendlyPopup();
      }}
    >
      {children}
    </button>
  );
}
