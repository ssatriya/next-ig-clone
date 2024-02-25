"use client";

import * as React from "react";
import { mergeRefs } from "react-merge-refs";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const inputRef = React.useRef<React.ElementRef<"input">>(null);

    const labelHandler = () => {
      inputRef.current?.focus();
    };

    return (
      <div className="relative flex items-center h-10 bg-igSecondaryBackground group focus-within:border-gray-400 border border-igElevatedSeparator rounded-sm">
        <input
          type={type}
          className={cn(
            "flex h-full bg-transparent w-full pt-[9px] pr-0 pb-[7px] pl-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-sm border-igElevatedSeparator focus-visible:ring-none focus-visible:ring-0",
            className,
            props.value !== "" && "pb-0 text-xs text-background transition"
          )}
          ref={mergeRefs([inputRef, ref])}
          {...props}
        />
        <label
          onClick={labelHandler}
          className={cn(
            "absolute px-[9px] text-xs text-igSecondaryText cursor-text",
            props.value !== ""
              ? "text-xs scale-[0.8333] origin-left translate-y-[-10px] transition-all"
              : "translate-y-0 origin-left transition-all z-10"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
