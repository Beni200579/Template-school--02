import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import AppLayout from './components/layout/AppLayout'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AlunosPage from './pages/AlunosPage'
import ProfessoresPage from './pages/ProfessoresPage'
import TurmasPage from './pages/TurmasPage'
import NotasPage from './pages/NotasPage'
import TarefasPage from './pages/TarefasPage'
import CalendarioPage from './pages/CalendarioPage'
import PagamentosPage from './pages/PagamentosPage'
import ComunicadosPage from './pages/ComunicadosPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'
import ServicosPage from './pages/ServicosPage'

function AppContent() {
  const { loggedIn } = useStore()
  const [module, setModule] = useState('dashboard')
  const [action, setAction] = useState<string | undefined>()

  const handleNavigate = (mod: string, act?: string) => {
    setModule(mod)
    setAction(act)
  }

  if (!loggedIn) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (module) {
      case 'dashboard':
        return <DashboardPage />
      case 'inscricao':
        return <AlunosPage action="inscricao" />
      case 'matriculas':
        return <AlunosPage action="matriculas" />
      case 'professores':
        return <ProfessoresPage action={action} />
      case 'turmas':
        return <TurmasPage />
      case 'notas':
        return <NotasPage />
      case 'tarefas':
        return <TarefasPage action={action} />
      case 'calendario':
        return <CalendarioPage />
      case 'servicos':
        return <ServicosPage />
      case 'pagamentos':
        return <PagamentosPage />
      case 'comunicados':
        return <ComunicadosPage />
      case 'configuracoes':
        return <ConfiguracoesPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AppLayout module={module} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
