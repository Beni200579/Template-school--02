import { useState } from 'react'
import AppLogo from '../ui/AppLogo'

interface SidebarProps {
  collapsed: boolean
  activeModule: string
  onNavigate: (module: string) => void
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const navItems = [
  { module: 'dashboard', label: 'Painel', icon: 'bi-grid-fill' },
  { module: 'alunos', label: 'Alunos', icon: 'bi-people-fill' },
  { module: 'servicos', label: 'Serviços', icon: 'bi-gear-wide-connected' },
  { module: 'pagamentos', label: 'Pagamentos', icon: 'bi-credit-card-fill' },
]

export default function Sidebar({
  collapsed,
  activeModule,
  onNavigate,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [showAlunosSubmenu, setShowAlunosSubmenu] = useState(false)

  const sidebarContent = (
    <div
      className={`h-full flex flex-col bg-white dark:bg-kitanda-darkCard border-r border-kitanda-border dark:border-kitanda-darkBorder transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-[260px]'
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-kitanda-border dark:border-kitanda-darkBorder shrink-0">
        <AppLogo
          showText={!collapsed}
          markClassName="w-9 h-9"
          textClassName="font-semibold text-kitanda-deep whitespace-nowrap"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeModule === item.module
          return (
            <div key={item.module}>
              <button
                onClick={() => {
                  if (item.module === 'alunos') {
                    setShowAlunosSubmenu(!showAlunosSubmenu)
                  } else {
                    onNavigate(item.module)
                    onMobileClose()
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-400'
                    : 'text-kitanda-muted dark:text-kitanda-darkTextMuted hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:text-kitanda-deep dark:hover:text-kitanda-darkText'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <i className={`bi ${item.icon} text-lg ${isActive ? 'text-emerald-500' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.module === 'alunos' && (
                  <i className={`bi ${showAlunosSubmenu ? 'bi-chevron-down' : 'bi-chevron-right'} text-xs`} />
                )}
              </button>
              
              {!collapsed && showAlunosSubmenu && item.module === 'alunos' && (
                <div className="mt-1 ml-9 space-y-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-kitanda-darkTextMuted hover:text-emerald-600 dark:hover:text-emerald-400">Inscrição</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-kitanda-darkTextMuted hover:text-emerald-600 dark:hover:text-emerald-400">Matrícula</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-kitanda-darkTextMuted hover:text-emerald-600 dark:hover:text-emerald-400">Confirmação</button>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-kitanda-border dark:border-kitanda-darkBorder px-2 py-3">
        <button
          onClick={() => onNavigate('configuracoes')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeModule === 'configuracoes'
              ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-400'
              : 'text-kitanda-muted dark:text-kitanda-darkTextMuted hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:text-kitanda-deep dark:hover:text-kitanda-darkText'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Configurações' : undefined}
        >
          <i className={`bi bi-gear-fill text-lg ${activeModule === 'configuracoes' ? 'text-emerald-500' : ''}`} />
          {!collapsed && <span>Configurações</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="hidden md:flex items-center justify-center h-10 border-t border-kitanda-border dark:border-kitanda-darkBorder text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-kitanda-deep dark:hover:text-kitanda-darkText transition-colors shrink-0"
      >
        <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-lg`} />
      </button>
    </div>
  )

  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative w-[260px] h-full shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
