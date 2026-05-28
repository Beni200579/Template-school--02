import { useState, useEffect } from 'react'
import Modal, { ModalHeader } from '../components/ui/Modal'
import { CustomSelect } from '../components/CustomSelect'
import { useStore } from '../store'

type ServiceStatus = 'disponível' | 'indisponível' | 'pendente' | 'em análise' | 'aprovado' | 'aguardando pagamento' | 'em execução' | 'concluído' | 'cancelado'

interface CatalogService {
  id: string
  name: string
  code: string
  category: string
  description: string
  icon: string
  price: number
  discount: number
  limitPerStudent: number
  estimatedTime: string
  priority: 'baixa' | 'média' | 'alta'
  paid: boolean
  available: boolean
}

interface ServiceRequest {
  id: string
  serviceId: string
  serviceName: string
  serviceCode: string
  category: string
  price: number
  paid: boolean

  studentNumber: string
  studentName: string
  course: string
  turma: string
  email: string
  phone: string

  requestDate: string
  description: string
  observations: string
  attachments: string[]
  priority: 'baixa' | 'média' | 'alta'

  paymentMethod: string
  paymentReference: string
  receiptNumber: string
  paymentStatus: 'pendente' | 'pago' | 'isento'

  responsibleEmployee: string
  department: string
  approvalDate: string
  executionDate: string
  conclusionDate: string

  status: ServiceStatus
  progress: number
  createdAt: string
  updatedAt: string
  history: { date: string; action: string; user: string }[]
}

const CATEGORIES = [
  { id: 'academicos', name: 'Académicos', icon: 'bi-mortarboard', color: 'bg-blue-500' },
  { id: 'documentais', name: 'Documentais', icon: 'bi-file-earmark-text', color: 'bg-emerald-500' },
  { id: 'financeiros', name: 'Financeiros', icon: 'bi-wallet2', color: 'bg-amber-500' },
  { id: 'biblioteca', name: 'Biblioteca', icon: 'bi-book', color: 'bg-violet-500' },
  { id: 'transporte', name: 'Transporte', icon: 'bi-bus-front', color: 'bg-cyan-500' },
  { id: 'alojamento', name: 'Alojamento', icon: 'bi-house-door', color: 'bg-rose-500' },
  { id: 'bolsas', name: 'Bolsas', icon: 'bi-award', color: 'bg-yellow-500' },
  { id: 'suporte', name: 'Suporte', icon: 'bi-headset', color: 'bg-slate-500' },
]

const CATALOG: CatalogService[] = [
  { id: 'cert-matricula', name: 'Certificado de Matrícula', code: 'SRV-DOC-001', category: 'documentais', description: 'Emissão de certificado digital de matrícula para o ano letivo vigente.', icon: 'bi-file-earmark-check', price: 5000, discount: 0, limitPerStudent: 5, estimatedTime: '24h', priority: 'média', paid: true, available: true },
  { id: 'declar-frequencia', name: 'Declaração de Frequência', code: 'SRV-DOC-002', category: 'documentais', description: 'Declaração comprovativa de frequência regular no curso.', icon: 'bi-file-text', price: 2500, discount: 0, limitPerStudent: 10, estimatedTime: '12h', priority: 'média', paid: true, available: true },
  { id: 'historico', name: 'Histórico Escolar', code: 'SRV-DOC-003', category: 'documentais', description: 'Extrato completo do histórico académico com disciplinas e classificações.', icon: 'bi-journal-text', price: 7500, discount: 0, limitPerStudent: 3, estimatedTime: '48h', priority: 'alta', paid: true, available: true },
  { id: 'certidao-notas', name: 'Certidão de Notas', code: 'SRV-ACAD-001', category: 'academicos', description: 'Certidão atualizada com as notas de todas as disciplinas realizadas.', icon: 'bi-clipboard-data', price: 3000, discount: 0, limitPerStudent: 5, estimatedTime: '24h', priority: 'média', paid: true, available: true },
  { id: 'revisao-prova', name: 'Revisão de Prova', code: 'SRV-ACAD-002', category: 'academicos', description: 'Solicitação de revisão de prova escrita. Prazo máximo 5 dias úteis.', icon: 'bi-search-heart', price: 0, discount: 0, limitPerStudent: 2, estimatedTime: '72h', priority: 'alta', paid: false, available: true },
  { id: 'matricula-especial', name: 'Matrícula Especial', code: 'SRV-ACAD-003', category: 'academicos', description: 'Matrícula fora do período regular para disciplinas isoladas.', icon: 'bi-person-plus', price: 10000, discount: 0, limitPerStudent: 1, estimatedTime: '48h', priority: 'alta', paid: true, available: true },
  { id: '2via-fatura', name: '2ª Via de Fatura/Recibo', code: 'SRV-FIN-001', category: 'financeiros', description: 'Reemissão de fatura ou recibo de pagamento anterior.', icon: 'bi-receipt', price: 1000, discount: 0, limitPerStudent: 8, estimatedTime: '6h', priority: 'baixa', paid: true, available: true },
  { id: 'comp-pagamento', name: 'Comprovativo de Pagamento', code: 'SRV-FIN-002', category: 'financeiros', description: 'Extrato financeiro e comprovativo de liquidação de propinas.', icon: 'bi-credit-card-check', price: 0, discount: 0, limitPerStudent: 15, estimatedTime: '6h', priority: 'média', paid: false, available: true },
  { id: 'emprestimo-bib', name: 'Empréstimo Bibliotecário', code: 'SRV-BIB-001', category: 'biblioteca', description: 'Solicitação de empréstimo de obras e livros da biblioteca central.', icon: 'bi-bookmark-check', price: 0, discount: 0, limitPerStudent: 20, estimatedTime: '2h', priority: 'baixa', paid: false, available: true },
  { id: 'reserva-bib', name: 'Reserva de Sala de Estudo', code: 'SRV-BIB-002', category: 'biblioteca', description: 'Reserva de sala de estudo em grupo ou individual na biblioteca.', icon: 'bi-lamp', price: 0, discount: 0, limitPerStudent: 10, estimatedTime: '1h', priority: 'baixa', paid: false, available: true },
  { id: 'passe-transporte', name: 'Passe de Transporte', code: 'SRV-TRP-001', category: 'transporte', description: 'Solicitação de passe mensal de transporte universitário.', icon: 'bi-bus-front-fill', price: 15000, discount: 0, limitPerStudent: 12, estimatedTime: '24h', priority: 'média', paid: true, available: true },
  { id: 'alojamento-cand', name: 'Candidatura a Alojamento', code: 'SRV-ALO-001', category: 'alojamento', description: 'Candidatura a residência universitária para o ano letivo.', icon: 'bi-building', price: 0, discount: 0, limitPerStudent: 1, estimatedTime: '7d', priority: 'alta', paid: false, available: true },
  { id: 'bolsa-merito', name: 'Bolsa de Mérito', code: 'SRV-BOL-001', category: 'bolsas', description: 'Candidatura a bolsa de mérito académico para alunos com média superior a 16.', icon: 'bi-trophy', price: 0, discount: 0, limitPerStudent: 1, estimatedTime: '15d', priority: 'alta', paid: false, available: true },
  { id: 'suporte-ti', name: 'Suporte Técnico (TI)', code: 'SRV-SUP-001', category: 'suporte', description: 'Reporte de problemas técnicos: email institucional, plataforma, rede.', icon: 'bi-gear-wide-connected', price: 0, discount: 0, limitPerStudent: 20, estimatedTime: '24h', priority: 'média', paid: false, available: true },
]

function getProgressForStatus(status: ServiceStatus): number {
  const map: Record<ServiceStatus, number> = {
    'disponível': 0, 'indisponível': 0, 'pendente': 14, 'em análise': 28, 'aprovado': 42,
    'aguardando pagamento': 57, 'em execução': 71, 'concluído': 100, 'cancelado': 0
  }
  return map[status] ?? 0
}

function getStatusBadge(status: ServiceStatus) {
  const styles: Record<ServiceStatus, string> = {
    'disponível': 'bg-slate-100 text-slate-700',
    'indisponível': 'bg-red-100 text-red-700',
    'pendente': 'bg-amber-100 text-amber-700',
    'em análise': 'bg-blue-100 text-blue-700',
    'aprovado': 'bg-emerald-100 text-emerald-700',
    'aguardando pagamento': 'bg-orange-100 text-orange-700',
    'em execução': 'bg-violet-100 text-violet-700',
    'concluído': 'bg-emerald-600 text-white',
    'cancelado': 'bg-slate-200 text-slate-600',
  }
  return styles[status]
}

function formatKz(v: number) {
  return v.toLocaleString('pt-PT') + ' Kz'
}

export default function ServicosPage() {
  const { data: storeData, showToast } = useStore()
  const { user } = storeData

  const [activeTab, setActiveTab] = useState<'catalogo' | 'pedidos'>('catalogo')
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('todas')

  const [reqForm, setReqForm] = useState({
    description: '',
    observations: '',
    paymentMethod: '',
    paymentReference: '',
    priority: 'média' as 'baixa' | 'média' | 'alta',
    attachmentName: '',
  })

  const [adminActionId, setAdminActionId] = useState<string | null>(null)
  const [adminActionType, setAdminActionType] = useState<'approve' | 'execute' | 'complete' | 'cancel'>('approve')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kitanda_servicos_db')
      if (saved) {
        const parsed = JSON.parse(saved)
        setRequests(parsed.requests || [])
      }
    } catch { /* ignore */ }
  }, [])

  const persist = (reqs: ServiceRequest[]) => {
    setRequests(reqs)
    localStorage.setItem('kitanda_servicos_db', JSON.stringify({ requests: reqs }))
  }

  const filteredCatalog = CATALOG.filter(s => categoryFilter === 'todas' || s.category === categoryFilter)

  const openRequestForm = (service: CatalogService) => {
    if (!service.available) {
      showToast('Este serviço está temporariamente indisponível.', 'error')
      return
    }
    const userCount = requests.filter(r => r.serviceId === service.id && r.studentName === user.name).length
    if (userCount >= service.limitPerStudent) {
      showToast(`Limite de solicitações atingido (${service.limitPerStudent}) para este serviço.`, 'error')
      return
    }
    setSelectedService(service)
    setReqForm({ description: '', observations: '', paymentMethod: '', paymentReference: '', priority: 'média', attachmentName: '' })
    setShowRequestModal(true)
  }

  const submitRequest = () => {
    if (!selectedService) return
    if (!reqForm.description.trim()) {
      showToast('Descreva o motivo da solicitação.', 'error')
      return
    }
    if (selectedService.paid && !reqForm.paymentMethod) {
      showToast('Selecione o método de pagamento.', 'error')
      return
    }
    if (selectedService.paid && !reqForm.paymentReference.trim()) {
      showToast('Insira a referência do pagamento.', 'error')
      return
    }

    const now = new Date().toLocaleDateString('pt-PT')
    const id = `SR-${Date.now()}`
    const newReq: ServiceRequest = {
      id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      serviceCode: selectedService.code,
      category: selectedService.category,
      price: selectedService.price,
      paid: selectedService.paid,

      studentNumber: 'EST-' + Math.floor(1000 + Math.random() * 9000),
      studentName: user.name,
      course: 'Curso Geral',
      turma: 'Turma A',
      email: user.name.toLowerCase().replace(/\s/g, '.') + '@escola.ao',
      phone: '+244 923 456 789',

      requestDate: now,
      description: reqForm.description,
      observations: reqForm.observations,
      attachments: reqForm.attachmentName ? [reqForm.attachmentName] : [],
      priority: reqForm.priority,

      paymentMethod: reqForm.paymentMethod,
      paymentReference: reqForm.paymentReference,
      receiptNumber: selectedService.paid ? `REC-SRV-${Math.floor(1000 + Math.random() * 9000)}` : '',
      paymentStatus: selectedService.paid ? 'pago' : 'isento',

      responsibleEmployee: '',
      department: CATEGORIES.find(c => c.id === selectedService.category)?.name || '',
      approvalDate: '',
      executionDate: '',
      conclusionDate: '',

      status: 'pendente',
      progress: 14,
      createdAt: now,
      updatedAt: now,
      history: [{ date: now, action: 'Solicitação criada', user: user.name }],
    }

    persist([newReq, ...requests])
    setShowRequestModal(false)
    setSelectedService(null)
    showToast(`Solicitação registada: ${selectedService.name}`, 'success')
  }

  const handleAdminAction = () => {
    if (!adminActionId) return
    const now = new Date().toLocaleDateString('pt-PT')
    const updated = requests.map(r => {
      if (r.id !== adminActionId) return r

      let newStatus: ServiceStatus = r.status
      let historyEntry = { date: now, action: '', user: user.name }

      if (adminActionType === 'approve') {
        newStatus = 'aprovado'
        historyEntry.action = 'Solicitação aprovada'
        r.approvalDate = now
        if (r.paid && r.paymentStatus === 'pago') {
          newStatus = 'aguardando pagamento'
          historyEntry.action = 'Aprovado — aguarda pagamento'
        }
      } else if (adminActionType === 'execute') {
        newStatus = 'em execução'
        historyEntry.action = 'Em execução pelo departamento'
        r.executionDate = now
      } else if (adminActionType === 'complete') {
        newStatus = 'concluído'
        historyEntry.action = 'Serviço concluído'
        r.conclusionDate = now
      } else if (adminActionType === 'cancel') {
        newStatus = 'cancelado'
        historyEntry.action = 'Solicitação cancelada'
      }

      return {
        ...r,
        status: newStatus,
        progress: getProgressForStatus(newStatus),
        updatedAt: now,
        history: [...r.history, historyEntry],
      }
    })

    persist(updated)
    setAdminActionId(null)
    showToast(`Solicitação ${adminActionType === 'cancel' ? 'cancelada' : 'atualizada'} com sucesso.`, 'success')
  }

  const handleReceiptUpload = () => {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = 'image/*,.pdf'
    inp.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        setReqForm(prev => ({ ...prev, attachmentName: file.name }))
        showToast('Comprovativo anexado.', 'success')
      }
    }
    inp.click()
  }

  const progressBars = [
    { pct: 14, label: 'Solicitado', color: 'bg-amber-500' },
    { pct: 28, label: 'Em Análise', color: 'bg-blue-500' },
    { pct: 42, label: 'Aprovado', color: 'bg-emerald-500' },
    { pct: 57, label: 'Pagamento', color: 'bg-orange-500' },
    { pct: 71, label: 'Execução', color: 'bg-violet-500' },
    { pct: 100, label: 'Concluído', color: 'bg-emerald-600' },
  ]

  return (
    <div className="space-y-6 fade-in-up">

      {/* HEADER */}
      <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase text-emerald-600">Central de Serviços</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Serviços Académicos</h1>
          <p className="text-sm text-kitanda-muted">Gestão de solicitações, catálogo de serviços e aprovações.</p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-xl border border-kitanda-border px-3.5 py-2 flex flex-col items-center bg-white">
            <p className="text-[9px] text-kitanda-muted uppercase font-bold">Solicitações</p>
            <p className="text-lg font-black text-gray-900">{requests.length}</p>
          </div>
          <div className="rounded-xl border border-kitanda-border px-3.5 py-2 flex flex-col items-center bg-white">
            <p className="text-[9px] text-kitanda-muted uppercase font-bold">Concluídos</p>
            <p className="text-lg font-black text-gray-900">{requests.filter(r => r.status === 'concluído').length}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button onClick={() => setActiveTab('catalogo')} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === 'catalogo' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted hover:text-gray-900'}`}>
          <i className="bi bi-grid-fill mr-1" /> Catálogo de Serviços
        </button>
        <button onClick={() => setActiveTab('pedidos')} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === 'pedidos' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted hover:text-gray-900'}`}>
          <i className="bi bi-clipboard-check mr-1" /> Gestão de Pedidos ({requests.filter(r => r.status !== 'concluído' && r.status !== 'cancelado').length})
        </button>
      </div>

      {/* TAB 1: CATÁLOGO */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6 page-swap">

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategoryFilter('todas')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${categoryFilter === 'todas' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
              Todas
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${categoryFilter === cat.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                <i className={`${cat.icon}`} />
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCatalog.map(service => {
              const cat = CATEGORIES.find(c => c.id === service.category)
              return (
                <div key={service.id} className={`rounded-18 border p-4 shadow-sm space-y-3 transition-all hover:shadow-md ${service.available ? 'bg-white border-kitanda-border' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl ${cat?.color || 'bg-slate-500'} flex items-center justify-center text-white text-lg shadow-sm`}>
                      <i className={service.icon} />
                    </div>
                    {service.paid ? (
                      <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {formatKz(service.price)}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">Grátis</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{service.name}</h4>
                    <p className="text-[10px] text-kitanda-muted mt-0.5 line-clamp-2">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><i className="bi bi-clock" />{service.estimatedTime}</span>
                    <span className="flex items-center gap-1"><i className="bi bi-inboxes" />{service.limitPerStudent}</span>
                    {service.priority === 'alta' && <span className="text-amber-600 font-bold flex items-center gap-1"><i className="bi bi-exclamation-circle" />Urgente</span>}
                  </div>
                  <button
                    onClick={() => openRequestForm(service)}
                    disabled={!service.available}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${service.available ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    {service.available ? 'Solicitar Agora' : 'Indisponível'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GESTÃO DE PEDIDOS (Admin) */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4 page-swap">
          {requests.length === 0 ? (
            <div className="rounded-18 border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <i className="bi bi-inbox text-4xl text-slate-300" />
              <p className="text-sm font-bold text-slate-600 mt-2">Nenhuma solicitação encontrada.</p>
              <p className="text-xs text-kitanda-muted mt-1">As solicitações de serviços aparecerão aqui para gestão.</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="rounded-18 border border-kitanda-border bg-white shadow-sm">
                <div className="p-4 flex items-start justify-between gap-3 border-b border-kitanda-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-xl ${CATEGORIES.find(c => c.id === req.category)?.color || 'bg-slate-500'} flex items-center justify-center text-white shrink-0`}>
                      <i className={CATALOG.find(s => s.id === req.serviceId)?.icon || 'bi-gear'} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{req.serviceName}</h4>
                      <p className="text-[10px] text-kitanda-muted font-mono truncate">{req.studentName} • {req.serviceCode}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase whitespace-nowrap shrink-0 ${getStatusBadge(req.status)}`}>{req.status}</span>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><i className="bi bi-building" />{req.department}</span>
                    <span className="flex items-center gap-1"><i className="bi bi-flag" />{req.priority}</span>
                    <span className="flex items-center gap-1"><i className="bi bi-calendar3" />{req.requestDate}</span>
                    {req.paid && req.paymentStatus === 'pago' && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1"><i className="bi bi-check-circle" /> Pago</span>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-slate-50 border-t border-kitanda-border flex flex-wrap gap-2">
                  {req.status === 'pendente' && (
                    <button onClick={() => { setAdminActionId(req.id); setAdminActionType('approve'); handleAdminAction() }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 flex items-center gap-1"><i className="bi bi-check-circle" />Aprovar</button>
                  )}
                  {req.status === 'aprovado' && (
                    <button onClick={() => { setAdminActionId(req.id); setAdminActionType('execute'); handleAdminAction() }} className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-[10px] font-bold hover:bg-violet-700 flex items-center gap-1"><i className="bi bi-play-fill" />Executar</button>
                  )}
                  {req.status === 'em execução' && (
                    <button onClick={() => { setAdminActionId(req.id); setAdminActionType('complete'); handleAdminAction() }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1"><i className="bi bi-check2-all" />Concluir</button>
                  )}
                  {req.status !== 'cancelado' && req.status !== 'concluído' && (
                    <button onClick={() => { setAdminActionId(req.id); setAdminActionType('cancel'); handleAdminAction() }} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-50 flex items-center gap-1"><i className="bi bi-x-circle" />Cancelar</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REQUEST FORM MODAL */}
      <Modal open={showRequestModal} onClose={() => setShowRequestModal(false)}>
        <ModalHeader title="Solicitar Serviço" onClose={() => setShowRequestModal(false)} />
        <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">

          {selectedService && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
              <h4 className="font-black text-emerald-800">{selectedService.name}</h4>
              <p className="text-emerald-700">{selectedService.description}</p>
              <p className="text-emerald-700 font-bold">{selectedService.paid ? formatKz(selectedService.price) : 'Grátis'}</p>
              <p className="text-emerald-600 font-mono text-[10px]">{selectedService.code} • {selectedService.estimatedTime}</p>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block font-semibold text-gray-700">Descrição / Motivo da Solicitação *</span>
            <textarea
              rows={3}
              value={reqForm.description}
              onChange={(e) => setReqForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-xl border border-kitanda-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Descreva o motivo do pedido..."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-semibold text-gray-700">Observações Adicionais</span>
            <textarea
              rows={2}
              value={reqForm.observations}
              onChange={(e) => setReqForm(prev => ({ ...prev, observations: e.target.value }))}
              className="w-full rounded-xl border border-kitanda-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Informações complementares..."
            />
          </label>

          <CustomSelect
            label="Prioridade"
            value={reqForm.priority}
            onChange={(val) => setReqForm(prev => ({ ...prev, priority: val as any }))}
            options={[
              { label: 'Baixa', value: 'baixa' },
              { label: 'Média', value: 'média' },
              { label: 'Alta', value: 'alta' },
            ]}
          />

          <div className="block">
            <span className="mb-1.5 block font-semibold text-gray-700">Anexar Comprovativo / Documento</span>
            <div className="flex gap-2">
              <input type="text" readOnly value={reqForm.attachmentName || 'Nenhum ficheiro'} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 truncate" />
              <button onClick={handleReceiptUpload} className="px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold">Carregar</button>
            </div>
          </div>

          {selectedService?.paid && (
            <>
              <div className="border-t pt-4 space-y-4">
                <p className="font-bold text-gray-900 text-sm"><i className="bi bi-credit-card-2-front mr-1" />Dados de Pagamento</p>
                <CustomSelect
                  label="Método de Pagamento *"
                  value={reqForm.paymentMethod}
                  onChange={(val) => setReqForm(prev => ({ ...prev, paymentMethod: val }))}
                  options={[
                    { label: 'Selecionar', value: '' },
                    { label: 'Transferência Bancária', value: 'Transferência Bancária' },
                    { label: 'Multicaixa Express', value: 'Multicaixa Express' },
                    { label: 'Depósito Bancário', value: 'Depósito' },
                  ]}
                />
                <label className="block">
                  <span className="mb-1.5 block font-semibold text-gray-700">Nº de Referência / Comprovativo *</span>
                  <input type="text" value={reqForm.paymentReference} onChange={(e) => setReqForm(prev => ({ ...prev, paymentReference: e.target.value }))}
                    className="w-full rounded-xl border border-kitanda-border px-3.5 py-2.5 text-sm outline-none" placeholder="Insira o código da transação" />
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setShowRequestModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold">Cancelar</button>
            <button onClick={submitRequest} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">Enviar Solicitação</button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
