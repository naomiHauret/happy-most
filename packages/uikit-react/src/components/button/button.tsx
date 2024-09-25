import { type HTMLArkProps, ark } from "@ark-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

/**
 * Brand styling for any UI element that implements a button-like appearance/behaviour (button, link)
 */
const recipeButton = cva(
  [
    "inline-flex items-center cursor-pointer no-underline text-neutral-11 text-xs font-body",
    "[&:is([aria-disabled=true],:disabled)]:opacity-50 [&:is([aria-disabled=true],:disabled)]:cursor-not-allowed [&:is([aria-disabled=true],:disabled)]:shadow-none",
  ],
  {
    variants: {
      intent: {
        primary: ["border"],
      },
      scale: {
        default: "px-3 py-2 rounded-md border",
      },
      label: {
        default: "font-bold",
      },
    },
    defaultVariants: {
      intent: "primary",
      scale: "default",
      label: "default",
    },
  },
);

type ButtonVariantsProps = VariantProps<typeof recipeButton>;
interface ButtonProps extends ButtonVariantsProps, HTMLArkProps<"button"> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ scale, intent, className, ...rest }, ref) => {
    return (
      <ark.button
        className={recipeButton({ scale, intent, className })}
        ref={ref}
        {...rest}
      />
    );
  },
);

Button.displayName = "Button";
export { recipeButton, Button, type ButtonVariantsProps };
