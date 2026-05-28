import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store'
import NotificationButton from '../ui/NotificationButton'

interface HeaderProps {
  onMenuToggle: () => void
  onNavigate: (module: string) => void
  onSearchOpen: () => void
  activeModule: string
}

const quickActionMap: Record<string, string> = {
  dashboard: 'tarefas',
  inscricao: 'matriculas',
  matriculas: 'matriculas',
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-kitanda-border bg-white px-4 shadow-sm shadow-slate-200/60 md:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-kitanda-muted transition-colors hover:bg-slate-100 md:hidden"
        title="Abrir menu"
        type="button"
      >
        <i className="bi bi-list text-xl" />
      </button>

      <button
        onClick={onSearchOpen}
        className="hidden h-10 max-w-md flex-1 cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 text-left text-kitanda-muted transition-colors hover:bg-slate-200 sm:flex"
        type="button"
      >
        <i className="bi bi-search" />
        <span className="text-sm">Pesquisar...</span>
        <span className="ml-auto rounded border border-kitanda-border bg-white px-1.5 py-0.5 text-xs text-kitanda-muted">
          Ctrl+K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={handleQuickAction}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-kitanda-emerald transition-colors hover:bg-emerald-50"
          title="Ação rápida"
          type="button"
        >
          <i className="bi bi-plus-lg text-xl" />
        </button>

        <NotificationButton
          onClick={() => onNavigate('comunicados')}
          hasUnread={unreadCount > 0}
        />

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-2 pr-2 transition-colors hover:bg-slate-100"
            type="button"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white">
              {data.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left text-sm leading-tight sm:block">
              <p className="font-semibold text-kitanda-deep">{data.user.name}</p>
              <p className="text-xs text-kitanda-muted">{data.user.role}</p>
            </div>
            <i className={`bi bi-chevron-down text-xs text-kitanda-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-12 w-64 overflow-hidden rounded-18 border border-kitanda-border bg-white shadow-xl shadow-slate-200/70"
              role="menu"
            >
              <div className="border-b border-kitanda-border px-4 py-3">
                <p className="text-sm font-semibold text-kitanda-deep">{data.user.name}</p>
                <p className="text-xs text-kitanda-muted">{data.user.schoolName}</p>
              </div>

              <button
                onClick={handleGoToSettings}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-kitanda-text transition-colors hover:bg-slate-50"
                type="button"
                role="menuitem"
              >
                <i className="bi bi-person-gear text-kitanda-muted" />
                Definições da conta
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
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
