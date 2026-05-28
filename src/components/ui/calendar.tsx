import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3 w-full",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-gray-900",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          "absolute left-1 inline-flex items-center justify-center rounded-lg",
          "h-7 w-7 text-kitanda-muted hover:bg-slate-100 hover:text-gray-900",
          "transition-colors disabled:pointer-events-none disabled:opacity-40"
        ),
        button_next: cn(
          "absolute right-1 inline-flex items-center justify-center rounded-lg",
          "h-7 w-7 text-kitanda-muted hover:bg-slate-100 hover:text-gray-900",
          "transition-colors disabled:pointer-events-none disabled:opacity-40"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-kitanda-muted rounded-md w-9 font-medium text-[0.75rem] text-center",
        week: "flex w-full mt-1.5",
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-emerald-50 [&:has([aria-selected])]:rounded-lg",
          "[&:has([aria-selected].day-outside)]:bg-emerald-50/40"
        ),
        day_button: cn(
          "inline-flex items-center justify-center rounded-lg",
          "h-9 w-9 text-sm font-normal text-gray-700",
          "transition-colors hover:bg-slate-100 hover:text-gray-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitanda-emerald/40",
          "disabled:pointer-events-none disabled:opacity-40"
        ),
        range_end: "day-range-end",
        selected:
          "bg-kitanda-emerald! text-white! hover:bg-kitanda-emerald! hover:text-white! focus:bg-kitanda-emerald! focus:text-white! rounded-lg!",
        today:
          "bg-emerald-50 text-kitanda-emerald font-semibold rounded-lg",
        outside:
          "day-outside text-kitanda-muted opacity-40 aria-selected:bg-emerald-50/40 aria-selected:text-kitanda-muted",
        disabled: "text-kitanda-muted opacity-40 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-emerald-50 aria-selected:text-gray-900 aria-selected:rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
