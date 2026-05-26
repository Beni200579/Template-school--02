interface MobileNavProps {
  activeModule: string
  onNavigate: (module: string) => void
}

const items = [
  { module: 'dashboard', label: 'Início', icon: 'bi-house-fill' },
  { module: 'alunos', label: 'Alunos', icon: 'bi-people-fill' },
  { module: 'tarefas', label: 'Tarefas', icon: 'bi-check2-square' },
  { module: 'pagamentos', label: 'Finanças', icon: 'bi-credit-card-fill' },
  { module: 'configuracoes', label: 'Definições', icon: 'bi-gear-fill' },
]

export default function MobileNav({ activeModule, onNavigate }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-kitanda-darkCard border-t border-kitanda-border dark:border-kitanda-darkBorder px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = activeModule === item.module
          return (
            <button
              key={item.module}
              onClick={() => onNavigate(item.module)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'text-emerald-500'
                  : 'text-kitanda-muted dark:text-kitanda-darkTextMuted'
              }`}
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
