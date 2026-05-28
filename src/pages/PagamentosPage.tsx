import { useState, useEffect } from 'react'
import { useStore } from '../store'
import Modal, { ModalHeader } from '../components/ui/Modal'
import { DatePickerField } from '../components/CustomCalendar'
import { CustomSelect } from '../components/CustomSelect'

// Local Types
interface PaymentRecord {
  id: string
  transactionNumber: string
  reference: string
  receiptNumber: string
  financialCode: string
  
  studentMatricula: string
  studentNumber: string
  studentName: string
  course: string
  turma: string
  academicYear: string
  
  type: 'matrícula' | 'propina' | 'mensalidade' | 'exame' | 'documento' | 'certificado' | 'transporte' | 'uniforme' | 'biblioteca' | 'laboratório' | 'outro'
  totalValue: number
  paidValue: number
  remainingBalance: number
  currency: string
  discountApplied: number // value in Kz
  lateFee: number // multa in Kz
  interest: number // juros in Kz
  scholarship: number // percentage
  
  method: 'dinheiro' | 'transferência bancária' | 'cartão' | 'referência bancária' | 'carteira digital' | 'multicaixa' | 'depósito' | 'pagamento online'
  status: 'pendente' | 'partialmente pago' | 'pago' | 'vencido' | 'cancelado' | 'reembolsado'
  
  issueDate: string
  dueDate: string
  paymentDate?: string
  confirmationDate?: string
  
  proofAttached: string
  digitallySigned: boolean
}

interface FinancingContract {
  id: string
  contractCode: string
  financingType: 'Crédito Estudantil' | 'Bolsa Parcial' | 'Apoio Social' | 'Desconto Especial'
  
  studentNumber: string
  studentName: string
  course: string
  
  totalValue: number
  initialDeposit: number
  installmentsCount: number
  installmentValue: number
  interestRate: number // %
  adminFee: number // %
  remainingBalance: number
  status: 'ativo' | 'aprovado' | 'aguardando aprovação' | 'concluído' | 'inadimplente' | 'cancelado'
  
  installments: {
    number: number
    value: number
    dueDate: string
    status: 'pendente' | 'pago' | 'vencido'
    delayDays: number
    lateFeeApplied: number
  }[]
}

const DEFAULT_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-001',
    transactionNumber: 'TX-2026-98124',
    reference: 'REF-8871210',
    receiptNumber: 'REC-2026-1011',
    financialCode: 'FIN-CODE-882',
    studentMatricula: 'MAT-2026-4811',
    studentNumber: 'EST-2026-4812',
    studentName: 'Ana Cláudia Martins',
    course: 'Engenharia Informática',
    turma: 'Turma A',
    academicYear: '2026',
    type: 'matrícula',
    totalValue: 18000,
    paidValue: 18000,
    remainingBalance: 0,
    currency: 'Kz',
    discountApplied: 0,
    lateFee: 0,
    interest: 0,
    scholarship: 0,
    method: 'multicaixa',
    status: 'pago',
    issueDate: '01/05/2026',
    dueDate: '10/05/2026',
    paymentDate: '05/05/2026',
    confirmationDate: '05/05/2026',
    proofAttached: 'comprovativo_matricula_ana.pdf',
    digitallySigned: true
  },
  {
    id: 'pay-002',
    transactionNumber: 'TX-2026-98125',
    reference: 'REF-8871211',
    receiptNumber: 'REC-2026-1012',
    financialCode: 'FIN-CODE-883',
    studentMatricula: 'MAT-2026-7840',
    studentNumber: 'EST-2026-7841',
    studentName: 'António José Neto',
    course: 'Medicina',
    turma: 'Turma B',
    academicYear: '2026',
    type: 'propina',
    totalValue: 65000,
    paidValue: 40000,
    remainingBalance: 25000,
    currency: 'Kz',
    discountApplied: 0,
    lateFee: 0,
    interest: 0,
    scholarship: 0,
    method: 'transferência bancária',
    status: 'partialmente pago',
    issueDate: '05/05/2026',
    dueDate: '20/05/2026',
    paymentDate: '15/05/2026',
    confirmationDate: '16/05/2026',
    proofAttached: 'recibo_transferencia_antonio.png',
    digitallySigned: true
  },
  {
    id: 'pay-003',
    transactionNumber: 'TX-2026-98126',
    reference: 'REF-8871212',
    receiptNumber: 'REC-2026-1013',
    financialCode: 'FIN-CODE-884',
    studentMatricula: 'MAT-2026-3189',
    studentNumber: 'EST-2026-3190',
    studentName: 'Bárbara Filipa Lopes',
    course: 'Direito',
    turma: 'Turma A',
    academicYear: '2026',
    type: 'propina',
    totalValue: 40000,
    paidValue: 0,
    remainingBalance: 40000,
    currency: 'Kz',
    discountApplied: 4000, // 10% discount
    lateFee: 2500, // overdue fine
    interest: 1500, // interest
    scholarship: 10,
    method: 'referência bancária',
    status: 'vencido',
    issueDate: '01/05/2026',
    dueDate: '15/05/2026',
    proofAttached: 'recibo_bancario_barbara.jpg',
    digitallySigned: false
  },
  {
    id: 'pay-004',
    transactionNumber: 'TX-2026-98127',
    reference: 'REF-8871213',
    receiptNumber: 'REC-2026-1014',
    financialCode: 'FIN-CODE-885',
    studentMatricula: 'MAT-2026-1101',
    studentNumber: 'EST-2026-1102',
    studentName: 'Cláudio Manuel Cruz',
    course: 'Gestão de Empresas',
    turma: 'Turma C',
    academicYear: '2026',
    type: 'exame',
    totalValue: 12000,
    paidValue: 0,
    remainingBalance: 12000,
    currency: 'Kz',
    discountApplied: 0,
    lateFee: 0,
    interest: 0,
    scholarship: 0,
    method: 'carteira digital',
    status: 'pendente',
    issueDate: '24/05/2026',
    dueDate: '30/05/2026',
    proofAttached: 'comprovativo_pag_carteira_claudio.pdf',
    digitallySigned: false
  }
]

const DEFAULT_FINANCING: FinancingContract[] = [
  {
    id: 'fin-001',
    contractCode: 'CONTR-2026-4819',
    financingType: 'Crédito Estudantil',
    studentNumber: 'EST-2026-4812',
    studentName: 'Ana Cláudia Martins',
    course: 'Engenharia Informática',
    totalValue: 450000,
    initialDeposit: 45000,
    installmentsCount: 10,
    installmentValue: 40500,
    interestRate: 2,
    adminFee: 1.5,
    remainingBalance: 324000,
    status: 'ativo',
    installments: [
      { number: 1, value: 40500, dueDate: '15/05/2026', status: 'pago', delayDays: 0, lateFeeApplied: 0 },
      { number: 2, value: 40500, dueDate: '15/06/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 3, value: 40500, dueDate: '15/07/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 4, value: 40500, dueDate: '15/08/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 5, value: 40500, dueDate: '15/09/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 6, value: 40500, dueDate: '15/10/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 7, value: 40500, dueDate: '15/11/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 8, value: 40500, dueDate: '15/12/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 9, value: 40500, dueDate: '15/01/2027', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 10, value: 40500, dueDate: '15/02/2027', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
    ]
  },
  {
    id: 'fin-002',
    contractCode: 'CONTR-2026-9921',
    financingType: 'Apoio Social',
    studentNumber: 'EST-2026-3190',
    studentName: 'Bárbara Filipa Lopes',
    course: 'Direito',
    totalValue: 360000,
    initialDeposit: 0,
    installmentsCount: 8,
    installmentValue: 45000,
    interestRate: 0,
    adminFee: 0,
    remainingBalance: 360000,
    status: 'inadimplente',
    installments: [
      { number: 1, value: 45000, dueDate: '10/05/2026', status: 'vencido', delayDays: 16, lateFeeApplied: 2500 },
      { number: 2, value: 45000, dueDate: '10/06/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 3, value: 45000, dueDate: '10/07/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 4, value: 45000, dueDate: '10/08/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 5, value: 45000, dueDate: '10/09/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 6, value: 45000, dueDate: '10/10/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 7, value: 45000, dueDate: '10/11/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
      { number: 8, value: 45000, dueDate: '10/12/2026', status: 'pendente', delayDays: 0, lateFeeApplied: 0 },
    ]
  }
]

export default function PagamentosPage() {
  const { data: storeData, showToast } = useStore()
  const { user, students } = storeData

  // Tabs: 'painel' | 'ledg' | 'fin' | 'rep'
  const [activeTab, setActiveTab] = useState<'painel' | 'ledg' | 'fin' | 'rep'>('painel')

  // Database persistent states
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [financings, setFinancings] = useState<FinancingContract[]>([])

  // Load from local storage
  useEffect(() => {
    const savedDb = localStorage.getItem('kitanda_financeiro_db')
    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb)
        setPayments(parsed.payments || DEFAULT_PAYMENTS)
        setFinancings(parsed.financings || DEFAULT_FINANCING)
      } catch (e) {
        setPayments(DEFAULT_PAYMENTS)
        setFinancings(DEFAULT_FINANCING)
      }
    } else {
      setPayments(DEFAULT_PAYMENTS)
      setFinancings(DEFAULT_FINANCING)
    }
  }, [])

  // Persist DB
  const saveDb = (pList: PaymentRecord[], fList: FinancingContract[]) => {
    setPayments(pList)
    setFinancings(fList)
    localStorage.setItem('kitanda_financeiro_db', JSON.stringify({
      payments: pList,
      financings: fList
    }))
  }

  // Modals status
  const [showPayModal, setShowPayModal] = useState(false)
  const [showFinModal, setShowFinModal] = useState(false)

  // Ledger Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [typeFilter, setTypeFilter] = useState('todos')

  // Financial Report states
  const [reportStudentQuery, setReportStudentQuery] = useState('')

  // Form states - Registration Payment
  const [payFormData, setPayFormData] = useState({
    studentId: '', // selected from students dropdown
    type: 'propina' as PaymentRecord['type'],
    totalValue: 40000,
    paidValue: 40000,
    discountApplied: 0,
    method: 'transferência bancária' as PaymentRecord['method'],
    reference: '',
    proofFileName: '',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  })

  // Form states - Financing Request
  const [finFormData, setFinFormData] = useState({
    studentId: '',
    financingType: 'Crédito Estudantil' as FinancingContract['financingType'],
    totalValue: 450000,
    initialDeposit: 45000,
    installmentsCount: 10,
    interestRate: 2,
    adminFee: 1.5,
  })

  // Calculations for dynamic fine/interest rate settings
  const [lateFeeSetting, setLateFeeSetting] = useState(2500) // late payment flat fee
  const [interestSetting, setInterestSetting] = useState(1.5) // delay interest per week

  // Synchronize dynamic student selection in pay form
  useEffect(() => {
    if (payFormData.studentId) {
      const selectedStudent = students.find(s => s.id === payFormData.studentId)
      if (selectedStudent) {
        // Automatically determine defaults
        let defVal = 40000
        if (payFormData.type === 'matrícula') defVal = 18000
        if (payFormData.type === 'exame') defVal = 12000
        if (payFormData.type === 'documento' || payFormData.type === 'certificado') defVal = 5000
        
        setPayFormData(prev => ({
          ...prev,
          totalValue: defVal,
          paidValue: defVal
        }))
      }
    }
  }, [payFormData.studentId, payFormData.type, students])

  // Approve pending receipt
  const handleApprovePayment = (id: string) => {
    const updated = payments.map(p => {
      if (p.id === id) {
        const randRec = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
        return {
          ...p,
          status: 'pago' as const,
          receiptNumber: randRec,
          confirmationDate: new Date().toLocaleDateString('pt-PT'),
          digitallySigned: true,
          remainingBalance: p.totalValue - p.paidValue - p.discountApplied
        }
      }
      return p
    })
    saveDb(updated, financings)
    showToast('Comprovativo Validado e Recibo Oficial Gerado!', 'success')
  }

  // Validate proof / add signature
  const handleSignReceipt = (id: string) => {
    const updated = payments.map(p => {
      if (p.id === id) {
        return { ...p, digitallySigned: true }
      }
      return p
    })
    saveDb(updated, financings)
    showToast('Assinatura Digital aplicada ao comprovativo.', 'success')
  }

  // Cancel Transaction
  const handleCancelTransaction = (id: string) => {
    const updated = payments.map(p => {
      if (p.id === id) {
        return { ...p, status: 'cancelado' as const, remainingBalance: p.totalValue }
      }
      return p
    })
    saveDb(updated, financings)
    showToast('Transação cancelada institucionalmente.', 'info')
  }

  // Submit New Payment (with validation & duplicate check)
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validate fields
    if (!payFormData.studentId) {
      showToast('Selecione um estudante da lista.', 'error')
      return
    }
    if (!payFormData.reference.trim()) {
      showToast('O número de referência do comprovativo é obrigatório.', 'error')
      return
    }

    // 2. Prevent duplicate payments based on Reference
    const isDuplicate = payments.some(p => p.reference.toLowerCase() === payFormData.reference.trim().toLowerCase())
    if (isDuplicate) {
      showToast('ERRO: Já existe um registo de pagamento com esta referência bancária!', 'error')
      return
    }

    const selectedStudent = students.find(s => s.id === payFormData.studentId)
    if (!selectedStudent) return

    const randId = `pay-${Math.floor(100000 + Math.random() * 900000)}`
    const randTx = `TX-2026-${Math.floor(10000 + Math.random() * 90000)}`
    const randFin = `FIN-CODE-${Math.floor(100 + Math.random() * 899)}`

    const finalPaid = Number(payFormData.paidValue)
    const finalTotal = Number(payFormData.totalValue)
    const finalDiscount = Number(payFormData.discountApplied)
    const remaining = finalTotal - finalPaid - finalDiscount

    let status: PaymentRecord['status'] = 'pago'
    if (remaining > 0 && finalPaid > 0) status = 'partialmente pago'
    if (finalPaid === 0) status = 'pendente'

    const newPay: PaymentRecord = {
      id: randId,
      transactionNumber: randTx,
      reference: payFormData.reference.trim(),
      receiptNumber: status === 'pago' ? `REC-2026-${Math.floor(1000 + Math.random() * 9000)}` : '',
      financialCode: randFin,
      
      studentMatricula: selectedStudent.studentNumber || 'MAT-2026-MOCK',
      studentNumber: selectedStudent.studentNumber || selectedStudent.id,
      studentName: selectedStudent.name,
      course: selectedStudent.course || 'Curso Geral',
      turma: 'Turma A',
      academicYear: '2026',
      
      type: payFormData.type,
      totalValue: finalTotal,
      paidValue: finalPaid,
      remainingBalance: remaining,
      currency: 'Kz',
      discountApplied: finalDiscount,
      lateFee: 0,
      interest: 0,
      scholarship: 0,
      
      method: payFormData.method,
      status,
      
      issueDate: new Date().toLocaleDateString('pt-PT'),
      dueDate: new Date(payFormData.dueDate).toLocaleDateString('pt-PT'),
      paymentDate: finalPaid > 0 ? new Date().toLocaleDateString('pt-PT') : undefined,
      confirmationDate: finalPaid > 0 ? new Date().toLocaleDateString('pt-PT') : undefined,
      proofAttached: payFormData.proofFileName || 'comprovativo_simulado.pdf',
      digitallySigned: finalPaid > 0
    }

    saveDb([newPay, ...payments], financings)
    setShowPayModal(false)
    showToast('Pagamento registrado e validado no caixa!', 'success')
    
    // reset form
    setPayFormData({
      studentId: '',
      type: 'propina',
      totalValue: 40000,
      paidValue: 40000,
      discountApplied: 0,
      method: 'transferência bancária',
      reference: '',
      proofFileName: '',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    })
  }

  // Create Financing Contract (automatic scheduling)
  const handleSubmitFinancing = (e: React.FormEvent) => {
    e.preventDefault()

    if (!finFormData.studentId) {
      showToast('Selecione o estudante beneficiário.', 'error')
      return
    }

    const selectedStudent = students.find(s => s.id === finFormData.studentId)
    if (!selectedStudent) return

    const randFinId = `fin-${Math.floor(1000 + Math.random() * 9000)}`
    const randContract = `CONTR-2026-${Math.floor(1000 + Math.random() * 9000)}`

    const principal = finFormData.totalValue - finFormData.initialDeposit
    const baseInstallment = principal / finFormData.installmentsCount
    // Calculate compound or flat monthly addition based on interest + admin fee
    const addedInterestValue = (baseInstallment * finFormData.interestRate) / 100
    const addedAdminFeeValue = (baseInstallment * finFormData.adminFee) / 100
    const finalInstallmentValue = Math.round(baseInstallment + addedInterestValue + addedAdminFeeValue)

    // Generate monthly installment dates
    const installments = []
    for (let i = 1; i <= finFormData.installmentsCount; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() + i)
      installments.push({
        number: i,
        value: finalInstallmentValue,
        dueDate: d.toLocaleDateString('pt-PT'),
        status: 'pendente' as const,
        delayDays: 0,
        lateFeeApplied: 0
      })
    }

    const newFin: FinancingContract = {
      id: randFinId,
      contractCode: randContract,
      financingType: finFormData.financingType,
      studentNumber: selectedStudent.studentNumber || selectedStudent.id,
      studentName: selectedStudent.name,
      course: selectedStudent.course || 'Geral',
      totalValue: finFormData.totalValue,
      initialDeposit: finFormData.initialDeposit,
      installmentsCount: finFormData.installmentsCount,
      installmentValue: finalInstallmentValue,
      interestRate: finFormData.interestRate,
      adminFee: finFormData.adminFee,
      remainingBalance: principal,
      status: 'ativo',
      installments
    }

    saveDb(payments, [newFin, ...financings])
    setShowFinModal(false)
    showToast('Contrato de Financiamento estruturado com sucesso!', 'success')
  }

  // Pay single installment of a financing
  const handlePayInstallment = (contractId: string, installmentNumber: number) => {
    const updated = financings.map(c => {
      if (c.id === contractId) {
        const updatedInsts = c.installments.map(inst => {
          if (inst.number === installmentNumber) {
            return { ...inst, status: 'pago' as const }
          }
          return inst
        })
        const paidCount = updatedInsts.filter(i => i.status === 'pago').length
        const totalPaidVal = paidCount * c.installmentValue
        const newBalance = Math.max(0, (c.totalValue - c.initialDeposit) - totalPaidVal)
        const isCompleted = paidCount === c.installmentsCount

        return {
          ...c,
          remainingBalance: newBalance,
          status: isCompleted ? ('concluído' as const) : c.status,
          installments: updatedInsts
        }
      }
      return c
    })
    saveDb(payments, updated)
    showToast(`Mensalidade Nº ${installmentNumber} liquidada!`, 'success')
  }

  // Auto-generate Invoice receipt printable page
  const openInvoicePDF = (p: PaymentRecord) => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html>
        <head>
          <title>Fatura Recibo Oficial - ${p.receiptNumber || 'PROVISÓRIO'}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0F172A; background-color: #F8FAFC; }
            .card { background: #fff; max-width: 700px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; border-b: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 20px; font-weight: bold; color: #0F172A; }
            .logo span { color: #10B981; }
            .details { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
            th { background: #F1F5F9; font-weight: bold; color: #334155; }
            .total-section { margin-top: 30px; border-top: 2px solid #E2E8F0; padding-top: 15px; display: flex; flex-direction: column; align-items: flex-end; font-size: 13px; gap: 6px; }
            .total { font-size: 18px; font-weight: bold; color: #0F172A; }
            .signature { margin-top: 50px; border-top: 1px dashed #94A3B8; width: 250px; text-align: center; font-size: 11px; color: #64748B; padding-top: 8px; }
            .footer { text-align: center; color: #94A3B8; font-size: 11px; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="logo">ESCOLA<span>KITANDA</span></div>
                <p style="font-size: 11px; color: #64748B; margin-top: 4px;">Portal Universitário de Admissões</p>
              </div>
              <div style="text-align: right;">
                <h3 style="margin:0; font-size: 16px; color: #10B981;">FATURA / RECIBO</h3>
                <p style="font-size: 11px; font-family: monospace; margin: 4px 0 0 0;">Nº: ${p.receiptNumber || 'REC-PROVISORIO'}</p>
                <p style="font-size: 11px; font-family: monospace; margin: 2px 0 0 0;">Fin: ${p.financialCode}</p>
              </div>
            </div>

            <div class="details">
              <div>
                <h4 style="margin: 0 0 6px 0; color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Estudante Beneficiário</h4>
                <p><strong>Nome:</strong> ${p.studentName}</p>
                <p><strong>Nº Estudante:</strong> ${p.studentNumber}</p>
                <p><strong>Matrícula:</strong> ${p.studentMatricula}</p>
                <p><strong>Curso / Classe:</strong> ${p.course} • 2026</p>
              </div>
              <div style="text-align: right;">
                <h4 style="margin: 0 0 6px 0; color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Dados de Transação</h4>
                <p><strong>Método:</strong> ${p.method.toUpperCase()}</p>
                <p><strong>Operação / Ref:</strong> ${p.reference}</p>
                <p><strong>Emissão:</strong> ${p.issueDate}</p>
                <p><strong>Confirmação:</strong> ${p.confirmationDate || 'Aguardando validação'}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Descrição da Taxa</th>
                  <th style="text-align: right;">Multa / Juros</th>
                  <th style="text-align: right;">Desconto / Bolsa</th>
                  <th style="text-align: right;">Total Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Liquidamento de ${p.type.toUpperCase()} - Período Regular</td>
                  <td style="text-align: right; color: #EF4444;">+ ${(p.lateFee + p.interest).toLocaleString('pt-PT')} Kz</td>
                  <td style="text-align: right; color: #10B981;">- ${p.discountApplied.toLocaleString('pt-PT')} Kz</td>
                  <td style="text-align: right; font-weight: bold;">${p.totalValue.toLocaleString('pt-PT')} Kz</td>
                </tr>
              </tbody>
            </table>

            <div class="total-section">
              <p>Desconto Comercial: - ${p.discountApplied.toLocaleString('pt-PT')} Kz</p>
              <p>Multas e Juros por Atraso: + ${(p.lateFee + p.interest).toLocaleString('pt-PT')} Kz</p>
              <p class="total">Valor Pago Total: ${p.paidValue.toLocaleString('pt-PT')} Kz</p>
              <p style="color: #64748B;">Dívida Pendente: ${p.remainingBalance.toLocaleString('pt-PT')} Kz</p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
              <div class="signature">
                Contabilidade Académica
                <p style="font-size: 9px; color: #10B981; font-weight: bold; margin-top: 4px;">✔ DOCUMENTO ASSINADO DIGITALMENTE</p>
              </div>
              <div style="text-align: right; font-size: 11px; color: #94A3B8;">
                Código de Autenticação:<br>
                <span style="font-family: monospace; font-weight: bold; color: #334155;">AUTH-SECURE-${p.id.toUpperCase()}</span>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 Escola Kitanda. Alameda das Universidades, Luanda, Angola.</p>
              <p style="font-size: 9px; color: #94A3B8; margin-top: 4px;">Gerado Eletronicamente pelo Módulo Financeiro Geral Kitanda.</p>
            </div>
          </div>
        </body>
      </html>
    `)
    w.document.close()
  }

  // Filter computations for ledger
  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.studentNumber.includes(searchQuery) ||
                          p.reference.includes(searchQuery)
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter
    const matchesType = typeFilter === 'todos' || p.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Financial KPIs computations
  const totalRevenues = payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.paidValue, 0)
  const totalDebts = payments.filter(p => p.status === 'vencido' || p.status === 'partialmente pago').reduce((sum, p) => sum + p.remainingBalance, 0)
  const activeFinancingCount = financings.filter(f => f.status === 'ativo').length
  
  // Daily Revenues report (sum of payments done today)
  const todayStr = new Date().toLocaleDateString('pt-PT')
  const dailyRevenues = payments.filter(p => p.paymentDate === todayStr && p.status === 'pago').reduce((sum, p) => sum + p.paidValue, 0)

  // Delinquent Students (Inadimplentes) computation
  const delinquentList = financings.filter(f => f.status === 'inadimplente' || f.installments.some(inst => inst.status === 'vencido'))
  const overduePaymentsList = payments.filter(p => p.status === 'vencido')

  return (
    <div className="space-y-6 fade-in-up">
      
      {/* HEADER SECTION */}
      <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-950 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Administração & Finanças</span>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-kitanda-darkText mt-1">Gestão de Finanças & Financiamentos</h1>
          <p className="text-sm text-kitanda-muted dark:text-kitanda-darkTextMuted">Controle propinas, planos de financiamento, bolsas e conciliação bancária.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPayModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <i className="bi bi-cash-coin" />
            Registrar Pagamento
          </button>
          <button
            onClick={() => setShowFinModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <i className="bi bi-file-earmark-ruled" />
            Novo Financiamento / Bolsa
          </button>
        </div>
      </div>

      {/* METRIC CARD STATS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted font-bold uppercase">Receitas Totais</p>
            <div className="h-8 w-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center"><i className="bi bi-wallet" /></div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-kitanda-darkText mt-2">{totalRevenues.toLocaleString('pt-PT')} Kz</p>
          <span className="text-[10px] text-emerald-600 font-semibold">✔ Liquidadas com sucesso</span>
        </div>

        <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted font-bold uppercase">Receitas do Dia</p>
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center"><i className="bi bi-calendar-check" /></div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-kitanda-darkText mt-2">{dailyRevenues.toLocaleString('pt-PT')} Kz</p>
          <span className="text-[10px] text-blue-600 font-semibold"><i className="bi bi-clock mr-1" />Atualizado hoje ({todayStr})</span>
        </div>

        <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted font-bold uppercase">Dívidas & Inadimplência</p>
            <div className="h-8 w-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center"><i className="bi bi-exclamation-circle" /></div>
          </div>
          <p className="text-2xl font-extrabold text-red-600 mt-2">{totalDebts.toLocaleString('pt-PT')} Kz</p>
          <span className="text-[10px] text-red-500 font-bold"><i className="bi bi-exclamation-triangle-fill mr-1" />Alunos em atraso: {delinquentList.length + overduePaymentsList.length}</span>
        </div>

        <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted font-bold uppercase">Financiamentos Ativos</p>
            <div className="h-8 w-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center"><i className="bi bi-link-45deg" /></div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-kitanda-darkText mt-2">{activeFinancingCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold"><i className="bi bi-pie-chart-fill mr-1" />Créditos e bolsas parceladas</span>
        </div>
      </div>

      {/* MODULE TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-kitanda-darkBorder gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('painel')}
          className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'painel' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-slate-900'
          }`}
        >
          <i className="bi bi-speedometer2 mr-1.5" />
          Painel de Auditoria
        </button>
        <button
          onClick={() => setActiveTab('ledg')}
          className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'ledg' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-slate-900'
          }`}
        >
          <i className="bi bi-wallet2 mr-1.5" />
          Livro-Razão (Pagamentos)
        </button>
        <button
          onClick={() => setActiveTab('fin')}
          className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'fin' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-slate-900'
          }`}
        >
          <i className="bi bi-file-earmark-binary mr-1.5" />
          Planos de Financiamento ({financings.length})
        </button>
        <button
          onClick={() => setActiveTab('rep')}
          className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'rep' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-slate-900'
          }`}
        >
          <i className="bi bi-clipboard-data mr-1.5" />
          Alertas & Relatórios Académicos
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: PAINEL DE AUDITORIA */}
      {activeTab === 'painel' && (
        <div className="grid gap-6 lg:grid-cols-3 page-swap">
          
          {/* Quick Stats & Alerts list */}
          <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText flex items-center gap-1.5">
              <i className="bi bi-shield-check text-emerald-600" />
              Auditoria Financeira Recente
            </h3>
            
            <div className="space-y-3">
              {payments.slice(0, 3).map((p) => {
                const isOverdue = p.status === 'vencido'
                return (
                  <div key={p.id} className="p-4 rounded-xl border border-gray-100 dark:border-kitanda-darkBorder bg-slate-50/50 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                        isOverdue ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <i className={isOverdue ? 'bi-exclamation-triangle' : 'bi-check2-circle'} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-kitanda-darkText">{p.studentName}</p>
                        <p className="text-[11px] text-kitanda-muted dark:text-kitanda-darkTextMuted">Curso: {p.course} • Taxa de <span className="uppercase font-bold">{p.type}</span></p>
                        <p className="text-[10px] text-slate-500">Ref comprovativo: {p.reference}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-extrabold text-gray-900 dark:text-kitanda-darkText">{p.paidValue.toLocaleString('pt-PT')} Kz</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1.5 ${
                        p.status === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Fine Config settings */}
          <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText flex items-center gap-1.5">
              <i className="bi bi-gear" />
              Configuração Fiscal de Multas & Juros
            </h3>
            <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">Regras aplicadas a mensalidades e propinas vencidas.</p>

            <div className="space-y-4 pt-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-kitanda-darkText">Multa Fixa por Atraso (Kz)</span>
                <input
                  type="number"
                  value={lateFeeSetting}
                  onChange={(e) => setLateFeeSetting(Number(e.target.value))}
                  className="w-full rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-gray-900 dark:text-kitanda-darkText outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-kitanda-darkText">Taxa de Juros por Semana (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={interestSetting}
                  onChange={(e) => setInterestSetting(Number(e.target.value))}
                  className="w-full rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-gray-900 dark:text-kitanda-darkText outline-none"
                />
              </label>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-400">
                <p className="font-bold">💡 Automação Ativa:</p>
                <p className="mt-0.5">As multas e juros de atraso são integrados na fatura do aluno assim que o vencimento ultrapassa o prazo.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: LIVRO-RAZÃO (PAGAMENTOS REGISTRADOS) */}
      {activeTab === 'ledg' && (
        <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 page-swap">
          
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><i className="bi bi-search" /></span>
              <input
                type="text"
                placeholder="Pesquisar por Estudante, Referência ou Nº de Comprovante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-kitanda-border dark:border-kitanda-darkBorder text-gray-900 dark:text-kitanda-darkText text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            
            <div className="flex gap-2">
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: "Todos Estados", value: "todos" },
                  { label: "Pago", value: "pago" },
                  { label: "Pendente", value: "pendente" },
                  { label: "Parcial", value: "partialmente pago" },
                  { label: "Vencido", value: "vencido" },
                  { label: "Cancelado", value: "cancelado" },
                ]}
                className="w-40"
                triggerClassName="h-9 py-1 text-xs"
              />

              <CustomSelect
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { label: "Todas Taxas", value: "todos" },
                  { label: "Matrícula", value: "matrícula" },
                  { label: "Propina", value: "propina" },
                  { label: "Exame", value: "exame" },
                  { label: "Documento", value: "documento" },
                  { label: "Certificado", value: "certificado" },
                ]}
                className="w-40"
                triggerClassName="h-9 py-1 text-xs"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:bg-slate-950 text-slate-700 dark:text-kitanda-darkText font-bold text-xs">
                  <th className="px-4 py-3">Cód. Transação</th>
                  <th className="px-4 py-3">Estudante</th>
                  <th className="px-4 py-3">Taxa / Tipo</th>
                  <th className="px-4 py-3">Total / Liquidado</th>
                  <th className="px-4 py-3">Método / Ref</th>
                  <th className="px-4 py-3">Comprovativo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-kitanda-muted">Nenhum pagamento correspondente aos filtros.</td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const outstanding = p.remainingBalance
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all">
                        <td className="px-4 py-3.5 font-mono font-bold text-gray-900 dark:text-kitanda-darkText">
                          {p.transactionNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900 dark:text-kitanda-darkText">{p.studentName}</p>
                          <p className="text-[10px] text-kitanda-muted dark:text-kitanda-darkTextMuted font-mono">Nº: {p.studentNumber}</p>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-gray-800 dark:text-kitanda-darkText capitalize">
                          {p.type}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900 dark:text-kitanda-darkText">{p.paidValue.toLocaleString('pt-PT')} Kz</p>
                          <p className="text-[9px] text-slate-400">Total: {p.totalValue.toLocaleString('pt-PT')} Kz</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="capitalize font-semibold text-gray-700 dark:text-kitanda-darkText">{p.method}</p>
                          <p className="text-[10px] text-kitanda-muted dark:text-kitanda-darkTextMuted font-mono">Ref: {p.reference}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                          {p.proofAttached ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                              <i className="bi bi-file-earmark-check-fill" />
                              {p.proofAttached.slice(0, 18)}...
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold"><i className="bi bi-x-circle-fill mr-1" />Falta</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            p.status === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'pendente' ? 'bg-amber-100 text-amber-700' :
                            p.status === 'partialmente pago' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right flex justify-end gap-1.5">
                          {p.status !== 'pago' && p.status !== 'cancelado' && (
                            <button
                              onClick={() => handleApprovePayment(p.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                              title="Validar Comprovativo & Emitir Recibo"
                            >
                              Aprovar
                            </button>
                          )}
                          <button
                            onClick={() => openInvoicePDF(p)}
                            className="px-2.5 py-1 border border-gray-200 dark:border-kitanda-darkBorder text-slate-700 dark:text-kitanda-darkText hover:bg-slate-50 dark:hover:bg-slate-950 rounded font-bold"
                          >
                            Recibo
                          </button>
                          {p.status !== 'cancelado' && (
                            <button
                              onClick={() => handleCancelTransaction(p.id)}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                              title="Cancelar transação"
                            >
                              <i className="bi bi-x-circle" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PLANOS DE FINANCIAMENTO */}
      {activeTab === 'fin' && (
        <div className="space-y-6 page-swap">
          
          <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText flex items-center gap-1.5">
              <i className="bi bi-file-earmark-ruled-fill text-emerald-600" />
              Contratos Ativos de Financiamento & Crédito Estudantil
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {financings.map((f) => {
                const totalPaid = f.installments.filter(i => i.status === 'pago').length
                return (
                  <div key={f.id} className="p-5 border rounded-18 space-y-4 shadow-sm hover:border-emerald-300 transition-colors bg-white dark:bg-slate-950">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase">{f.financingType}</span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText mt-1.5">{f.studentName}</h4>
                        <p className="text-[10px] text-kitanda-muted dark:text-kitanda-darkTextMuted font-mono">Contrato: {f.contractCode}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          f.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {f.status}
                        </span>
                        <p className="text-xs font-mono font-bold text-gray-900 dark:text-kitanda-darkText mt-2">{f.remainingBalance.toLocaleString('pt-PT')} Kz Devedor</p>
                      </div>
                    </div>

                    {/* Progress Bar of Installments */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span>Mensalidades Liquidada:</span>
                        <span className="font-bold">{totalPaid} de {f.installmentsCount} parcelas</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(totalPaid / f.installmentsCount) * 100}%` }} />
                      </div>
                    </div>

                    {/* Installments Table Checklist */}
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fluxo de Amortização:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {f.installments.map((inst) => {
                          let instBg = "bg-slate-100 text-slate-600"
                          if (inst.status === 'pago') instBg = "bg-emerald-100 text-emerald-800"
                          if (inst.status === 'vencido') instBg = "bg-red-100 text-red-800 animate-pulse"

                          return (
                            <div key={inst.number} className={`p-2 rounded-lg text-center ${instBg} space-y-1`}>
                              <p className="text-[9px] font-bold uppercase">Parcela {inst.number}</p>
                              <p className="text-[10px] font-mono font-extrabold">{inst.value.toLocaleString('pt-PT')} Kz</p>
                              <p className="text-[8px] truncate">{inst.dueDate}</p>
                              
                              {inst.status !== 'pago' && (
                                <button
                                  onClick={() => handlePayInstallment(f.id, inst.number)}
                                  className="w-full mt-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[8px] font-bold"
                                >
                                  Pagar
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ALERTAS & RELATÓRIOS FINANCEIROS */}
      {activeTab === 'rep' && (
        <div className="space-y-6 page-swap">
          
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* INADIMPLENTES (Delinquent students) REPORT */}
            <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText flex items-center gap-1.5 text-red-600">
                <i className="bi bi-shield-exclamation" />
                Alunos Inadimplentes (Controlo de Dívidas)
              </h3>
              <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">Alunos com mensalidades expiradas. Serviços de certidão estão bloqueados.</p>

              <div className="space-y-3">
                {delinquentList.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-4 rounded-xl text-center">✔ Sem devedores críticos no momento.</p>
                ) : (
                  delinquentList.map(df => (
                    <div key={df.id} className="p-3 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-kitanda-darkText">{df.studentName}</p>
                        <p className="text-[10px] text-red-600 font-bold uppercase">{df.financingType} Inadimplente</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-gray-900 dark:text-kitanda-darkText">{df.remainingBalance.toLocaleString('pt-PT')} Kz</p>
                        <span className="text-[9px] text-red-600 font-bold"><i className="bi bi-lock-fill mr-1" />BLOQUEADO</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* HISTÓRICO FINANCEIRO POR ALUNO */}
            <div className="rounded-18 border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText flex items-center gap-1.5">
                <i className="bi bi-person-lines-fill" />
                Dossiê e Histórico Financeiro do Aluno
              </h3>
              <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">Digite o nome ou ID do aluno para puxar todo o extrato consolidado.</p>

              <input
                type="text"
                placeholder="Pesquisar por Estudante..."
                value={reportStudentQuery}
                onChange={(e) => setReportStudentQuery(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border text-xs rounded-xl"
              />

              {reportStudentQuery && (() => {
                const results = payments.filter(p => p.studentName.toLowerCase().includes(reportStudentQuery.toLowerCase()))
                return (
                  <div className="space-y-2 pt-2 border-t max-h-48 overflow-y-auto">
                    {results.length === 0 ? (
                      <p className="text-xs text-kitanda-muted">Nenhuma transação encontrada para este aluno.</p>
                    ) : (
                      results.map(r => (
                        <div key={r.id} className="p-2 border rounded-lg flex justify-between text-xs items-center bg-slate-50/50">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-kitanda-darkText capitalize">{r.type}</p>
                            <p className="text-[10px] text-slate-500">Data: {r.issueDate} • {r.method}</p>
                          </div>
                          <div className="text-right font-mono font-bold text-gray-900 dark:text-kitanda-darkText">
                            {r.paidValue.toLocaleString('pt-PT')} Kz
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )
              })()}
            </div>

          </div>

        </div>
      )}

      {/* REGISTRATION PAYMENT MODAL */}
      <Modal open={showPayModal} onClose={() => setShowPayModal(false)}>
        <ModalHeader title="Registrar Transação Financeira Académica" onClose={() => setShowPayModal(false)} />
        <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          <div className="grid gap-4 md:grid-cols-2">
            
            <CustomSelect
              label="Selecione o Estudante *"
              value={payFormData.studentId}
              onChange={(val) => setPayFormData({ ...payFormData, studentId: val })}
              options={[
                { label: 'Selecione da Base Geral', value: '' },
                ...students.map(s => ({ label: `${s.name} (${s.studentNumber || s.id})`, value: s.id }))
              ]}
              className="md:col-span-2"
            />

            <CustomSelect
              label="Tipo de Pagamento (Taxas) *"
              value={payFormData.type}
              onChange={(val) => setPayFormData({ ...payFormData, type: val as PaymentRecord['type'] })}
              options={[
                { label: "Propina / Mensalidade", value: "propina" },
                { label: "Inscrição & Matrícula", value: "matrícula" },
                { label: "Exame Geral / Recurso", value: "exame" },
                { label: "Certificado / Emissão Declarativa", value: "documento" },
                { label: "Transporte Escolar", value: "transporte" },
                { label: "Uniforme & Fardas", value: "uniforme" },
                { label: "Biblioteca / Multas Fiscais", value: "biblioteca" },
              ]}
            />

            <CustomSelect
              label="Método de Liquidação *"
              value={payFormData.method}
              onChange={(val) => setPayFormData({ ...payFormData, method: val as PaymentRecord['method'] })}
              options={[
                { label: "Transferência Bancária", value: "transferência bancária" },
                { label: "Dinheiro Físico (Tesouraria)", value: "dinheiro" },
                { label: "Cartão de Débito/Crédito", value: "cartão" },
                { label: "Referência Multicaixa", value: "referência bancária" },
                { label: "Multicaixa Express", value: "multicaixa" },
                { label: "Depósito Direto", value: "depósito" },
              ]}
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Valor Total do Serviço (Kz) *</span>
              <input
                type="number"
                required
                value={payFormData.totalValue}
                onChange={(e) => setPayFormData({ ...payFormData, totalValue: Number(e.target.value), paidValue: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Valor Pago No Caixa (Kz) *</span>
              <input
                type="number"
                required
                value={payFormData.paidValue}
                onChange={(e) => setPayFormData({ ...payFormData, paidValue: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Desconto Concedido (Kz)</span>
              <input
                type="number"
                value={payFormData.discountApplied}
                onChange={(e) => setPayFormData({ ...payFormData, discountApplied: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <DatePickerField
              label="Data de Vencimento"
              required
              value={payFormData.dueDate}
              onChange={(iso) => setPayFormData({ ...payFormData, dueDate: iso })}
            />

            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Número de Referência Única do Talão *</span>
              <input
                type="text"
                required
                value={payFormData.reference}
                onChange={(e) => setPayFormData({ ...payFormData, reference: e.target.value })}
                placeholder="Ex: REF-99827110"
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <div className="block md:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Anexar Arquivo de Comprovativo *</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={payFormData.proofFileName || 'Nenhum ficheiro selecionado'}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-gray-500 truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    const inp = document.createElement('input')
                    inp.type = 'file'
                    inp.accept = 'image/*,.pdf'
                    inp.onchange = (e: any) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setPayFormData(prev => ({ ...prev, proofFileName: file.name }))
                        showToast('Arquivo carregado!', 'success')
                      }
                    }
                    inp.click()
                  }}
                  className="px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Procurar
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowPayModal(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Salvar Registo Bancário
            </button>
          </div>
        </form>
      </Modal>

      {/* NEW FINANCING / BOLSA MODAL */}
      <Modal open={showFinModal} onClose={() => setShowFinModal(false)}>
        <ModalHeader title="Estruturar Plano de Financiamento ou Bolsa" onClose={() => setShowFinModal(false)} />
        <form onSubmit={handleSubmitFinancing} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          <div className="grid gap-4 md:grid-cols-2">
            
            <CustomSelect
              label="Selecione o Aluno *"
              value={finFormData.studentId}
              onChange={(val) => setFinFormData({ ...finFormData, studentId: val })}
              options={[
                { label: 'Selecione o Aluno da Base Geral', value: '' },
                ...students.map(s => ({ label: `${s.name} (${s.studentNumber || s.id})`, value: s.id }))
              ]}
              className="md:col-span-2"
            />

            <CustomSelect
              label="Tipo de Financiamento *"
              value={finFormData.financingType}
              onChange={(val) => setFinFormData({ ...finFormData, financingType: val as FinancingContract['financingType'] })}
              options={[
                { label: "Crédito Estudantil", value: "Crédito Estudantil" },
                { label: "Bolsa Parcial / Subsidio", value: "Bolsa Parcial" },
                { label: "Apoio Social Interno", value: "Apoio Social" },
                { label: "Desconto Comercial Especial", value: "Desconto Especial" },
              ]}
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Valor Total Financiado (Kz) *</span>
              <input
                type="number"
                required
                value={finFormData.totalValue}
                onChange={(e) => setFinFormData({ ...finFormData, totalValue: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Depósito de Entrada Inicial (Kz)</span>
              <input
                type="number"
                value={finFormData.initialDeposit}
                onChange={(e) => setFinFormData({ ...finFormData, initialDeposit: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <CustomSelect
              label="Quantidade de Parcelas Mensais *"
              value={String(finFormData.installmentsCount)}
              onChange={(val) => setFinFormData({ ...finFormData, installmentsCount: Number(val) })}
              options={[
                { label: "5 Parcelas", value: "5" },
                { label: "8 Parcelas", value: "8" },
                { label: "10 Parcelas (Anual Regular)", value: "10" },
                { label: "12 Parcelas", value: "12" },
              ]}
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Taxa de Juros por Parcela (%)</span>
              <input
                type="number"
                step="0.1"
                value={finFormData.interestRate}
                onChange={(e) => setFinFormData({ ...finFormData, interestRate: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Taxa Administrativa Contratual (%)</span>
              <input
                type="number"
                step="0.1"
                value={finFormData.adminFee}
                onChange={(e) => setFinFormData({ ...finFormData, adminFee: Number(e.target.value) })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

          </div>

          {/* Real-time installment calculation display */}
          {(() => {
            const principal = finFormData.totalValue - finFormData.initialDeposit
            const baseInstallment = principal / finFormData.installmentsCount
            const addedInterestValue = (baseInstallment * finFormData.interestRate) / 100
            const addedAdminFeeValue = (baseInstallment * finFormData.adminFee) / 100
            const finalInstallmentValue = Math.round(baseInstallment + addedInterestValue + addedAdminFeeValue)
            return (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Cálculo Provisório do Contrato</p>
                <p className="text-sm font-bold text-gray-900">Valor Mensal por Parcela: {finalInstallmentValue.toLocaleString('pt-PT')} Kz</p>
                <p className="text-[10px] text-slate-500">Composto por {finFormData.installmentsCount} parcelas mensais amortizáveis.</p>
              </div>
            )
          })()}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowFinModal(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Oficializar Crédito / Financiamento
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
