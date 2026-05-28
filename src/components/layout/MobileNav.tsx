interface MobileNavProps {
  activeModule: string
  onNavigate: (module: string) => void
}

const items = [
  { module: 'dashboard', label: 'Início', icon: 'bi-house-fill' },
  { module: 'inscricao', label: 'Admissões', icon: 'bi-pen-fill' },
  { module: 'matriculas', label: 'Matrículas', icon: 'bi-mortarboard-fill' },
  { module: 'pagamentos', label: 'Finanças', icon: 'bi-credit-card-fill' },
  { module: 'configuracoes', label: 'Definições', icon: 'bi-gear-fill' },
]

export default function MobileNav({ activeModule, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-kitanda-border bg-white px-2 pb-safe md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const isActive = activeModule === item.module
          return (
            <button
              key={item.module}
              onClick={() => onNavigate(item.module)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive ? 'text-emerald-500' : 'text-kitanda-muted'
              }`}
              type="button"
            >
              <i className={`bi ${item.icon} text-xl ${isActive ? 'text-emerald-500' : ''}`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
