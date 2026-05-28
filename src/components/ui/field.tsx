import * as React from "react"
import { cn } from "@/lib/utils"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
        {label && (
          <span className="block text-xs font-semibold text-gray-700 dark:text-kitanda-darkText mb-0.5">
            {label}
          </span>
        )}
        {children}
        {error && (
          <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>
        )}
      </div>
    )
  }
)
Field.displayName = "Field"
