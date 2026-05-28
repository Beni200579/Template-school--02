import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
}

export interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  required?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  label,
  error,
  className,
  triggerClassName,
  disabled = false,
  required = false,
}: CustomSelectProps) {
  // Find currently selected option to display, mapping empty string correctly
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Field className={className} label={label} error={error}>
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow text-left justify-between flex items-center h-10.5",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder text-gray-900 dark:text-kitanda-darkText shadow-lg rounded-xl min-w-[200px] z-50">
          <SelectGroup className="p-1">
            {options.map((opt) => opt.value !== "" && (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 text-gray-900 dark:text-kitanda-darkText cursor-pointer py-2.5 px-3.5 rounded-lg text-sm transition-colors outline-none"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
