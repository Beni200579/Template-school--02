import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../../store'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ToastContainer from '../ui/ToastContainer'
import SearchDialog from '../ui/SearchDialog'

interface AppLayoutProps {
  module: string
  onNavigate: (module: string, action?: string) => void
  children: React.ReactNode
}

const actionMap: Record<string, string> = {
  'alunos-matricular': 'alunos/matricular',
  'professores-novo': 'professores/novo',
  'tarefas-nova': 'tarefas/nova',
  'pagamentos-registrar': 'pagamentos/registrar',
  'comunicados-novo': 'comunicados/novo',
}

export default function AppLayout({
  module,
  onNavigate,
  children,
}: AppLayoutProps) {
  const { loggedIn } = useStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  function handleNavigate(mod: string) {
    onNavigate(mod)
    setMobileOpen(false)
  }

  const handleNavigateWithAction = useCallback(
    (target: string) => {
      const mapped = actionMap[target]
      if (mapped) {
        const [mod, act] = mapped.split('/')
        onNavigate(mod, act)
      } else {
        onNavigate(target)
      }
    },
    [onNavigate]
  )

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!loggedIn) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb] dark:bg-kitanda-darkBg">
      <Sidebar
        collapsed={collapsed}
        activeModule={module}
        onNavigate={handleNavigate}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          onNavigate={handleNavigateWithAction}
          onSearchOpen={() => setSearchOpen(true)}
          activeModule={module}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        <Footer />
      </div>

      <MobileNav activeModule={module} onNavigate={handleNavigate} />

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigateWithAction}
      />

      <ToastContainer />
    </div>
  )
}
