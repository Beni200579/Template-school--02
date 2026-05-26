import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store'

interface HeaderProps {
  onMenuToggle: () => void
  onNavigate: (module: string) => void
  onSearchOpen: () => void
  activeModule: string
}

const quickActionMap: Record<string, string> = {
  dashboard: 'tarefas',
  alunos: 'alunos/matricular',
  professores: 'professores/novo',
  turmas: 'turmas/nova',
  notas: 'notas/lancar',
  tarefas: 'tarefas/nova',
  calendario: 'calendario/novo',
  pagamentos: 'pagamentos/registrar',
  comunicados: 'comunicados/novo',
  configuracoes: 'configuracoes',
}

export default function Header({
  onMenuToggle,
  onNavigate,
  onSearchOpen,
  activeModule,
}: HeaderProps) {
  const { data, logout, showToast } = useStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const unreadCount = data.announcements.filter((a) => !a.read).length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleQuickAction() {
    const target = quickActionMap[activeModule] || 'tarefas'
    const [mod] = target.split('/')
    onNavigate(mod)
  }

  function handleGoToSettings() {
    setUserMenuOpen(false)
    onNavigate('configuracoes')
  }

  function handleLogout() {
    setUserMenuOpen(false)
    logout()
    showToast('Sessão terminada com sucesso.', 'info')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-kitanda-border px-4 md:px-6 h-16 flex items-center gap-3 shrink-0 shadow-sm shadow-slate-200/60">
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-kitanda-muted hover:bg-slate-100 transition-colors"
        title="Abrir menu"
      >
        <i className="bi bi-list text-xl" />
      </button>

      <button
        onClick={onSearchOpen}
        className="hidden sm:flex items-center gap-2 flex-1 max-w-md h-10 px-4 rounded-xl bg-slate-100 text-kitanda-muted cursor-pointer transition-colors hover:bg-slate-200 text-left"
        type="button"
      >
        <i className="bi bi-search" />
        <span className="text-sm">Pesquisar...</span>
        <span className="ml-auto text-xs px-1.5 py-0.5 rounded border border-kitanda-border bg-white text-kitanda-muted">
          Ctrl+K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={handleQuickAction}
          className="w-10 h-10 rounded-xl text-kitanda-emerald hover:bg-emerald-50 transition-colors flex items-center justify-center"
          title="Ação rápida"
          type="button"
        >
          <i className="bi bi-plus-lg text-xl" />
        </button>

        <button
          onClick={() => onNavigate('comunicados')}
          className="relative w-10 h-10 rounded-xl text-kitanda-muted hover:bg-slate-100 transition-colors flex items-center justify-center"
          title="Notificações"
          type="button"
        >
          <i className="bi bi-bell-fill text-lg" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-5 h-5 px-1 rounded-full bg-kitanda-red text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            type="button"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {data.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-sm leading-tight text-left">
              <p className="font-semibold text-kitanda-deep">
                {data.user.name}
              </p>
              <p className="text-xs text-kitanda-muted">
                {data.user.role}
              </p>
            </div>
            <i className={`bi bi-chevron-down text-xs text-kitanda-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-12 w-64 rounded-18 border border-kitanda-border bg-white shadow-xl shadow-slate-200/70 overflow-hidden"
              role="menu"
            >
              <div className="px-4 py-3 border-b border-kitanda-border">
                <p className="text-sm font-semibold text-kitanda-deep">{data.user.name}</p>
                <p className="text-xs text-kitanda-muted">{data.user.schoolName}</p>
              </div>

              <button
                onClick={handleGoToSettings}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-kitanda-text hover:bg-slate-50 transition-colors text-left"
                type="button"
                role="menuitem"
              >
                <i className="bi bi-person-gear text-kitanda-muted" />
                Definições da conta
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                type="button"
                role="menuitem"
              >
                <i className="bi bi-box-arrow-right" />
                Terminar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
