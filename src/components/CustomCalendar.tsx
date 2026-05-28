import { useState, type ChangeEvent, type ChangeEventHandler } from "react"
import type { DropdownNavProps, DropdownProps } from "react-day-picker"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Inline calendar panel – use this when you want a standalone picker  */
/* ------------------------------------------------------------------ */
export function CustomCalendar({
  selectedDate,
  onSelectDate,
  className,
  startMonth,
  endMonth,
}: {
  selectedDate?: Date
  onSelectDate?: (date: Date | undefined) => void
  className?: string
  startMonth?: Date
  endMonth?: Date
}) {
  const [date, setDate] = useState<Date | undefined>(selectedDate ?? new Date())

  const handleCalendarChange = (
    _value: string | number,
    _e: ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: { value: String(_value) },
    } as ChangeEvent<HTMLSelectElement>
    _e(_event)
  }

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onSelectDate?.(newDate)
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-kitanda-border bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <Calendar
        locale={ptBR}
        captionLayout="dropdown"
        classNames={{
          month_caption: "mx-0",
          root: "w-full",
          selected:
            "bg-kitanda-emerald text-white hover:bg-kitanda-emerald hover:text-white focus:bg-kitanda-emerald focus:text-white rounded-lg",
          today:
            "bg-emerald-50 text-kitanda-emerald font-semibold rounded-lg",
          day: "rounded-lg transition-colors hover:bg-slate-50",
        }}
        components={{
          Dropdown: (props: DropdownProps) => (
            <Select
              onValueChange={(value) => {
                if (props.onChange && value !== null) {
                  handleCalendarChange(value, props.onChange)
                }
              }}
              value={String(props.value)}
            >
              <SelectTrigger
                style={{ backgroundColor: "#ffffff", color: "#0F172A" }}
                className="h-8 text-xs font-semibold border border-kitanda-border first:grow focus:ring-2 focus:ring-kitanda-emerald/30 focus:outline-none rounded-lg shadow-none"
              >
                <SelectValue>
                  {props.options?.find((o) => o.value === props.value)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start" className="text-xs">
                {props.options?.map((option) => (
                  <SelectItem
                    disabled={option.disabled}
                    key={option.value}
                    value={String(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
          DropdownNav: (props: DropdownNavProps) => (
            <div className="flex w-full items-center gap-2 px-1">
              {props.children}
            </div>
          ),
        }}
        defaultMonth={date ?? new Date()}
        hideNavigation
        mode="single"
        onSelect={handleSelect}
        selected={date}
        startMonth={startMonth ?? new Date(1980, 0)}
        endMonth={endMonth ?? new Date(2060, 11)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* DatePickerField – button trigger + popover with CustomCalendar      */
/* Use this inside forms instead of <input type="date" />              */
/* ------------------------------------------------------------------ */
export function DatePickerField({
  value,
  onChange,
  placeholder = "Escolha uma data",
  className,
  label,
  required,
  startMonth,
  endMonth,
}: {
  value?: string          // ISO "YYYY-MM-DD"
  onChange?: (iso: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
  startMonth?: Date
  endMonth?: Date
}) {
  const selected = value ? new Date(value + "T00:00:00") : undefined

  return (
    <div className={className}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-kitanda-darkText">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 rounded-xl border border-kitanda-border bg-white px-4 py-2.5 text-sm text-left transition-shadow",
              "hover:border-kitanda-emerald/50 focus:outline-none focus:ring-2 focus:ring-kitanda-emerald/30",
              "dark:bg-slate-900 dark:border-kitanda-darkBorder dark:text-kitanda-darkText",
              !selected && "text-kitanda-muted dark:text-kitanda-darkTextMuted"
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-kitanda-muted" />
            <span className="flex-1 truncate">
              {selected
                ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-kitanda-border shadow-lg rounded-xl overflow-hidden"
          align="start"
          sideOffset={6}
        >
          <CustomCalendar
            selectedDate={selected}
            onSelectDate={(date) => {
              onChange?.(date ? date.toISOString().split("T")[0] : "")
            }}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
