import { useStore } from '../../store'

const iconMap: Record<string, string> = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

const colorMap: Record<string, string> = {
  success: 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  error: 'bg-rose-50 border-rose-500 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  info: 'bg-sky-50 border-sky-500 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
}

export default function ToastContainer() {
  const { toasts } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg pointer-events-auto animate-slideIn ${colorMap[toast.type]}`}
        >
          <i className={`bi ${iconMap[toast.type]} text-lg`} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
