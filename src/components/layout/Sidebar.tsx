import { useState } from 'react'
import { useStore } from '../../store'
import AppLogo from '../ui/AppLogo'

interface SidebarProps {
  collapsed: boolean
  activeModule: string
  onNavigate: (module: string, action?: string) => void
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const navItems = [
  { module: 'dashboard', label: 'Visão Geral', icon: 'bi-grid' },
  { module: 'alunos', label: 'Alunos', icon: 'bi-person-plus' },
  { module: 'servicos', label: 'Serviços', icon: 'bi-briefcase' },
  { module: 'pagamentos', label: 'Finanças', icon: 'bi-wallet2' },
]

const alunoItems = [
  { label: 'Inscrição', action: 'inscricao' },
  { label: 'Matrículas', action: 'matriculas' },
]

export default function Sidebar({
  collapsed,
  activeModule,
  onNavigate,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { data } = useStore()
  const [showAlunosSubmenu, setShowAlunosSubmenu] = useState(activeModule === 'alunos')

  const handleNavigate = (module: string, action?: string) => {
    onNavigate(module, action)
    onMobileClose()
  }

  const itemButtonClass = (active: boolean) =>
    collapsed
      ? `relative mx-auto flex h-11 w-11 items-center justify-center rounded-lg text-lg transition-colors ${
          active
            ? 'bg-[#101827] text-kitanda-emerald before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-kitanda-emerald'
            : 'text-[#6d789d] hover:bg-[#0b1022] hover:text-kitanda-darkText'
        }`
      : `relative flex w-full items-center justify-between px-3 py-3 text-sm font-semibold transition-colors ${
          active
            ? 'bg-[#101827] text-kitanda-darkText before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-kitanda-emerald'
            : 'text-kitanda-darkTextMuted hover:bg-[#0b1022] hover:text-kitanda-darkText'
        }`

  const sidebarContent = (
    <div
      className={`flex h-full flex-col overflow-hidden bg-kitanda-sidebar border-r border-[#11182b] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-[260px]'
      }`}
    >
      <div className={`flex h-20 shrink-0 items-center border-b border-[#11182b] ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        <AppLogo
          showText={!collapsed}
          markClassName="h-9 w-9 rounded-lg bg-white p-1 shadow-sm"
          textClassName="font-semibold text-kitanda-darkText whitespace-nowrap"
        />
      </div>

      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeModule === item.module
            const isAlunos = item.module === 'alunos'

            return (
              <div key={item.module}>
                <button
                  onClick={() => {
                    if (isAlunos) {
                      setShowAlunosSubmenu((open) => !open)
                      handleNavigate(item.module, 'inscricao')
                    } else {
                      handleNavigate(item.module)
                    }
                  }}
                  className={itemButtonClass(isActive)}
                  title={collapsed ? item.label : undefined}
                  type="button"
                >
                  <span className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <i className={`bi ${item.icon} text-lg ${isActive ? 'text-kitanda-emerald' : 'text-[#6d789d]'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && isAlunos && (
                    <i
                      className={`bi bi-chevron-right text-xs text-[#6d789d] transition-transform ${
                        showAlunosSubmenu ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>

                {!collapsed && isAlunos && showAlunosSubmenu && (
                  <div className="ml-10 mt-2 space-y-1">
                    {alunoItems.map((item, index) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigate('alunos', item.action)}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-[#697397] transition-all duration-200 hover:translate-x-1 hover:text-kitanda-emerald"
                        style={{ transitionDelay: `${index * 35}ms` }}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      <div className={collapsed ? 'px-2 py-2' : 'px-3 py-2'}>
        <button
          onClick={() => handleNavigate('configuracoes')}
          className={itemButtonClass(activeModule === 'configuracoes')}
          title={collapsed ? 'Configurações' : undefined}
          type="button"
        >
          <span className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <i className={`bi bi-gear text-lg ${activeModule === 'configuracoes' ? 'text-kitanda-emerald' : 'text-[#6d789d]'}`} />
            {!collapsed && <span>Configurações</span>}
          </span>
        </button>
      </div>

      <button
        onClick={() => handleNavigate('configuracoes')}
        className={`mx-auto mb-4 mt-3 flex items-center rounded-lg bg-[#061b24] text-left transition-colors hover:bg-[#082531] ${
          collapsed ? 'h-12 w-12 justify-center p-0' : 'w-[calc(100%-2rem)] gap-3 p-2.5'
        }`}
        title={collapsed ? data.user.name : undefined}
        type="button"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#073b37] text-xs font-bold text-kitanda-emerald">
          {data.user.name.slice(0, 2).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-kitanda-darkText">{data.user.name}</p>
              <p className="truncate text-[11px] font-medium text-kitanda-darkTextMuted">Perfil não configurado</p>
            </div>
            <i className="bi bi-chevron-right text-xs text-kitanda-darkTextMuted" />
          </>
        )}
      </button>

      <button
        onClick={onToggle}
        className="hidden h-10 shrink-0 items-center justify-center border-t border-[#11182b] text-kitanda-darkTextMuted transition-colors hover:text-kitanda-darkText md:flex"
        type="button"
      >
        <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-lg`} />
      </button>
    </div>
  )

  return (
    <>
      <aside className="hidden h-screen shrink-0 md:sticky md:top-0 md:block">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative h-full w-[260px] shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
