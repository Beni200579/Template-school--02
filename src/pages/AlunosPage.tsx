import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { useStore } from '../store'
import type { Student, EnrollmentApplication } from '../types'
import { CustomCalendar, DatePickerField } from '../components/CustomCalendar'
import { CustomSelect } from '../components/CustomSelect'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const PRESET_AVATARS = [
  { name: 'Estudante 1 (Masculino)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Estudante 2 (Feminino)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Estudante 3 (Masculino)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Estudante 4 (Feminino)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
]

const COURSES_LIST = [
  { id: 'eng_info', name: 'Engenharia Informática', baseMatricula: 18000, basePropina: 45000, campus: 'Campus Central' },
  { id: 'gest_emp', name: 'Gestão de Empresas', baseMatricula: 14000, basePropina: 35000, campus: 'Campus Talatona' },
  { id: 'direito', name: 'Direito', baseMatricula: 16000, basePropina: 40000, campus: 'Campus Palanca' },
  { id: 'medicina', name: 'Medicina', baseMatricula: 25000, basePropina: 65000, campus: 'Campus Central' },
  { id: 'psico', name: 'Psicologia Clínica', baseMatricula: 13000, basePropina: 32000, campus: 'Campus Talatona' },
]

const emptyForm = {
  fullName: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
  courseInterest: '',
  academicLevel: '',
  address: '',
  identityDocument: '',
}

const initialEnrollmentData = {
  // Passo 1: Pessoais
  fullName: '',
  photo: PRESET_AVATARS[0].url,
  birthDate: '',
  gender: '',
  nationality: 'Angolana',
  maritalStatus: '',
  phone: '',
  email: '',
  address: '',

  // Passo 2: Documentos
  identityType: 'BI' as 'BI' | 'PASSAPORTE',
  identityNumber: '',
  uploadedFiles: [] as { id: string; name: string; size: string; category: 'BI' | 'Certificado' | 'Residência' | 'Outro'; progress: number; status: 'uploading' | 'complete' }[],

  // Passo 3: Acadêmicos
  course: '',
  classYear: '1º Ano',
  shift: '',
  turma: '',
  campus: '',
  modality: 'Presencial',

  // Passo 4: Financeiros
  matriculaValue: 15000,
  propinaValue: 40000,
  discountPercent: 0,
  paymentMethod: '',
  paymentReference: '',
  paymentProofName: '',
  installments: 10,

  // Passo 5: Responsável
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  guardianAddress: '',
  hasGuardian: false,
}

// Vacancy Tracker
const getVacancies = (course: string, shift: string, turma: string) => {
  if (!course || !shift || !turma) return { total: 25, filled: 12 }
  if (course === 'Medicina' && shift === 'Manhã' && turma === 'Turma A') {
    return { total: 15, filled: 15 } // FULL
  }
  if (course === 'Engenharia Informática' && shift === 'Noite' && turma === 'Turma C') {
    return { total: 25, filled: 24 } // 1 left
  }
  // Deterministic count based on strings
  const hash = (course.length + shift.length + turma.length) % 6
  return { total: 25, filled: 8 + hash * 3 }
}

function calculateAge(birthDateString: string) {
  if (!birthDateString) return 0
  const today = new Date()
  const birthDate = new Date(birthDateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function today() {
  return new Date().toLocaleDateString('pt-PT')
}

export default function AlunosPage({ action: initialAction }: { action?: string }) {
  const { data, addInscription, addEnrollmentApplication, addStudent, showToast } = useStore()
  
  const [currentAction, setCurrentAction] = useState(initialAction || 'inscricao')
  const [studentTab, setStudentTab] = useState<'inscricao' | 'alunos'>('inscricao')
  const [enrollmentData, setEnrollmentData] = useState(initialEnrollmentData)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // Confirmed details (generated at confirm)
  const [generatedCodes, setGeneratedCodes] = useState<{
    enrollmentNumber: string
    studentNumber: string
    academicCode: string
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const [uploadCategory, setUploadCategory] = useState<'BI' | 'Certificado' | 'Residência' | 'Outro'>('BI')

  // Sync action from sidebar clicks
  useEffect(() => {
    setCurrentAction(initialAction || 'inscricao')
    if (initialAction === 'matriculas') {
      // Check for draft on load
      const savedDraft = localStorage.getItem('kitanda_enrollment_draft')
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          setEnrollmentData(parsed.data || initialEnrollmentData)
          setCurrentStepIndex(parsed.stepIndex || 0)
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, [initialAction])

  // Auto-save progress
  useEffect(() => {
    if (currentAction === 'matriculas' && !generatedCodes) {
      localStorage.setItem('kitanda_enrollment_draft', JSON.stringify({
        data: enrollmentData,
        stepIndex: currentStepIndex
      }))
    }
  }, [enrollmentData, currentStepIndex, currentAction, generatedCodes])

  // Set default financial values based on course
  useEffect(() => {
    const selectedCourse = COURSES_LIST.find(c => c.name === enrollmentData.course)
    if (selectedCourse) {
      setEnrollmentData(prev => ({
        ...prev,
        matriculaValue: selectedCourse.baseMatricula,
        propinaValue: selectedCourse.basePropina,
        campus: selectedCourse.campus
      }))
    }
  }, [enrollmentData.course])

  // Inscription Form state
  const [inscForm, setInscForm] = useState(emptyForm)

  const steps = [
    { label: 'Dados Pessoais', desc: 'Identificação básica', icon: 'bi-person-badge' },
    { label: 'Documentos', desc: 'Anexos obrigatórios', icon: 'bi-file-earmark-medical' },
    { label: 'Dados Académicos', desc: 'Curso & Turma', icon: 'bi-mortarboard' },
    { label: 'Dados Financeiros', desc: 'Pagamento & Propinas', icon: 'bi-wallet2' },
    { label: 'Responsável', desc: 'Encarregado', icon: 'bi-people' },
    { label: 'Revisão Final', desc: 'Resumo geral', icon: 'bi-clipboard-check' },
    { label: 'Confirmação', desc: 'Matrícula efetuada', icon: 'bi-shield-check' }
  ]

  const getVisualProgress = (index: number) => {
    const totalSteps = 7
    const filled = index + 1
    const pct = Math.round((filled / totalSteps) * 100)
    const barFilled = '|'.repeat(filled)
    const barEmpty = '-'.repeat(totalSteps - filled)
    return `[${barFilled}${barEmpty}] ${pct}%`
  }

  // Validate the current step
  const getStepErrors = (stepIdx: number): string[] => {
    const errs: string[] = []
    const d = enrollmentData

    if (stepIdx === 0) {
      if (!d.fullName || d.fullName.trim().split(' ').length < 2) {
        errs.push('Nome Completo deve conter nome e apelido.')
      }
      if (!d.photo) {
        errs.push('Foto tipo passe é obrigatória.')
      }
      if (!d.birthDate) {
        errs.push('Data de nascimento é obrigatória.')
      } else {
        const age = calculateAge(d.birthDate)
        if (age <= 0 || age > 100) errs.push('Data de nascimento inválida.')
      }
      if (!d.gender) errs.push('Selecione o gênero.')
      if (!d.nationality.trim()) errs.push('Nacionalidade é obrigatória.')
      if (!d.maritalStatus) errs.push('Selecione o estado civil.')
      
      const phoneClean = d.phone.replace(/\D/g, '')
      if (phoneClean.length < 9) {
        errs.push('Telefone deve possuir no mínimo 9 dígitos.')
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(d.email)) {
        errs.push('Insira um e-mail institucional ou pessoal válido.')
      }
      if (!d.address.trim() || d.address.trim().length < 5) {
        errs.push('Endereço completo é obrigatório (mín. 5 caracteres).')
      }
    }

    if (stepIdx === 1) {
      if (!d.identityNumber.trim() || d.identityNumber.trim().length < 8) {
        errs.push('Introduza um número de BI / Passaporte válido.')
      }
      const hasBI = d.uploadedFiles.some(f => f.category === 'BI' && f.status === 'complete')
      const hasCert = d.uploadedFiles.some(f => f.category === 'Certificado' && f.status === 'complete')
      const hasRes = d.uploadedFiles.some(f => f.category === 'Residência' && f.status === 'complete')

      if (!hasBI) errs.push('Cópia do BI/Passaporte é obrigatória.')
      if (!hasCert) errs.push('Certificado Escolar é obrigatório.')
      if (!hasRes) errs.push('Comprovativo de residência é obrigatório.')
    }

    if (stepIdx === 2) {
      if (!d.course) errs.push('Selecione o curso pretendido.')
      if (!d.classYear) errs.push('Selecione a classe/ano.')
      if (!d.shift) errs.push('Selecione o turno.')
      if (!d.turma) errs.push('Selecione a turma.')
      if (!d.campus) errs.push('Selecione o campus.')
      if (!d.modality) errs.push('Selecione a modalidade.')

      if (d.course && d.shift && d.turma) {
        const vac = getVacancies(d.course, d.shift, d.turma)
        if (vac.filled >= vac.total) {
          errs.push(`A turma selecionada está esgotada (${vac.filled}/${vac.total} vagas). Escolha outro turno ou turma.`)
        }
      }
    }

    if (stepIdx === 3) {
      if (!d.paymentMethod) errs.push('Selecione o método de pagamento.')
      if (!d.paymentReference.trim() || d.paymentReference.trim().length < 6) {
        errs.push('Insira a referência ou ID de transação do comprovativo (mín. 6 caracteres).')
      }
      if (!d.paymentProofName) errs.push('Deve anexar o comprovativo de pagamento.')
      if (d.matriculaValue <= 0) errs.push('O valor da matrícula é inválido.')
    }

    if (stepIdx === 4) {
      const isUnderage = calculateAge(d.birthDate) < 18
      if (isUnderage || d.hasGuardian) {
        if (!d.guardianName || d.guardianName.trim().split(' ').length < 2) {
          errs.push('Nome completo do Encarregado é obrigatório.')
        }
        if (!d.guardianRelation) errs.push('Selecione o grau de parentesco.')
        if (d.guardianPhone.replace(/\D/g, '').length < 9) {
          errs.push('Telefone do responsável é obrigatório (mín. 9 dígitos).')
        }
        if (!d.guardianAddress || d.guardianAddress.trim().length < 5) {
          errs.push('Endereço completo do responsável é obrigatório.')
        }
      }
    }

    return errs
  }

  const currentStepErrors = getStepErrors(currentStepIndex)
  const isStepValid = currentStepErrors.length === 0

  const handleNext = () => {
    if (!isStepValid) {
      showToast(currentStepErrors[0], 'error')
      return
    }
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0))
  }

  // File uploading simulator
  const startSimulatedUpload = (category: 'BI' | 'Certificado' | 'Residência' | 'Outro', fileName: string, sizeStr: string) => {
    const id = Date.now().toString()
    
    // Remove if there's already a file of the same category (impedir duplicados)
    const filteredFiles = enrollmentData.uploadedFiles.filter(f => f.category !== category)

    const newFile = {
      id,
      name: fileName,
      size: sizeStr,
      category,
      progress: 0,
      status: 'uploading' as const
    }

    setEnrollmentData(prev => ({
      ...prev,
      uploadedFiles: [...filteredFiles, newFile]
    }))

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 20
      if (currentProgress >= 100) {
        clearInterval(interval)
        setEnrollmentData(prev => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles.map(f => f.id === id ? { ...f, progress: 100, status: 'complete' } : f)
        }))
        showToast(`Documento (${category}) carregado com sucesso!`, 'success')
      } else {
        setEnrollmentData(prev => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles.map(f => f.id === id ? { ...f, progress: currentProgress } : f)
        }))
      }
    }, 150)
  }

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione um arquivo de imagem.', 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setEnrollmentData(prev => ({ ...prev, photo: event.target!.result as string }))
          showToast('Foto do estudante atualizada com sucesso.', 'success')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext !== 'pdf' && ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        showToast('Formato inválido! Apenas PDF, JPG ou PNG são permitidos.', 'error')
        return
      }
      
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      startSimulatedUpload(uploadCategory, file.name, sizeStr)
    }
  }

  const handleFinancialReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEnrollmentData(prev => ({
        ...prev,
        paymentProofName: file.name
      }))
      showToast('Comprovativo anexado com sucesso!', 'success')
    }
  }

  // Handle final enrollment submit
  const handleFinalSubmit = () => {
    if (!isStepValid) {
      showToast('Não pode concluir. Existem erros na revisão final.', 'error')
      return
    }

    // Generate codes
    const randomSuffix = () => Math.floor(1000 + Math.random() * 9000).toString()
    const enrollmentNumber = `MAT-2026-${randomSuffix()}`
    const studentNumber = `EST-2026-${randomSuffix()}`
    const academicCode = `ACAD-${Math.floor(10000 + Math.random() * 90000)}`

    setGeneratedCodes({
      enrollmentNumber,
      studentNumber,
      academicCode
    })

    // Construct EnrollmentApplication
    const newApp: EnrollmentApplication = {
      id: Date.now().toString(),
      fullName: enrollmentData.fullName,
      photo: enrollmentData.photo,
      birthDate: enrollmentData.birthDate,
      gender: enrollmentData.gender,
      nationality: enrollmentData.nationality,
      maritalStatus: enrollmentData.maritalStatus,
      birthPlace: enrollmentData.nationality,
      phone: enrollmentData.phone,
      email: enrollmentData.email,
      address: enrollmentData.address,
      
      documents: {
        identityType: enrollmentData.identityType,
        identityNumber: enrollmentData.identityNumber,
        issueDate: today(),
        issuePlace: enrollmentData.nationality,
        certificate: true,
        residenceProof: true,
        declaration: true,
        attachments: enrollmentData.uploadedFiles.map(f => f.name)
      },

      course: enrollmentData.course,
      classYear: enrollmentData.classYear,
      shift: enrollmentData.shift,
      turma: enrollmentData.turma,
      campus: enrollmentData.campus,
      academicYear: '2026',
      status: 'MATRICULADO',

      financial: {
        matriculaValue: enrollmentData.matriculaValue,
        propinaValue: enrollmentData.propinaValue,
        discount: (enrollmentData.propinaValue * enrollmentData.discountPercent) / 100,
        paymentMethod: enrollmentData.paymentMethod,
        paymentProof: enrollmentData.paymentProofName,
        status: 'PAGO'
      },

      guardian: {
        name: enrollmentData.guardianName || 'N/A',
        relation: enrollmentData.guardianRelation || 'N/A',
        phone: enrollmentData.guardianPhone || 'N/A',
        email: enrollmentData.guardianEmail || 'N/A'
      },

      createdAt: today(),
      updatedAt: today()
    }

    // Add to general Store
    addEnrollmentApplication(newApp)

    // Add as active Student
    const newStudent: Student = {
      id: studentNumber,
      studentNumber,
      name: enrollmentData.fullName,
      class: `${enrollmentData.course} - ${enrollmentData.classYear}`,
      email: enrollmentData.email,
      gpa: '14.0', // default starting GPA
      status: 'Ativo',
      attendance: '100%',
      parent: enrollmentData.guardianName || 'Próprio',
      phone: enrollmentData.phone,
      bi: enrollmentData.identityNumber,
      birthDate: enrollmentData.birthDate,
      course: enrollmentData.course,
      shift: enrollmentData.shift
    }
    addStudent(newStudent)

    // Move to step 7 (Confirmation)
    setCurrentStepIndex(6)

    // Clear Draft
    localStorage.removeItem('kitanda_enrollment_draft')
    showToast('Parabéns! Matrícula confirmada e registo institucional criado.', 'success')
  }

  const resetEnrollmentWizard = () => {
    setEnrollmentData(initialEnrollmentData)
    setCurrentStepIndex(0)
    setGeneratedCodes(null)
    localStorage.removeItem('kitanda_enrollment_draft')
  }

  // Pre-fill fields from pre-registration (inscription)
  const handlePromoteCandidate = (candidate: any) => {
    setEnrollmentData(prev => ({
      ...prev,
      fullName: candidate.fullName,
      phone: candidate.phone,
      email: candidate.email,
      birthDate: candidate.birthDate || '',
      gender: candidate.gender || '',
      course: candidate.courseInterest || '',
      address: candidate.address || ''
    }))
    setCurrentAction('matriculas')
    setCurrentStepIndex(0)
    showToast(`Dados de ${candidate.fullName} transferidos para a Matrícula!`, 'success')
  }

  // Normal Candidate Inscription submits
  function handleInscSubmit(event: FormEvent) {
    event.preventDefault()
    const inscription = {
      id: Date.now().toString(),
      fullName: inscForm.fullName,
      phone: inscForm.phone,
      email: inscForm.email,
      birthDate: inscForm.birthDate,
      gender: inscForm.gender,
      courseInterest: inscForm.courseInterest,
      academicLevel: inscForm.academicLevel,
      address: inscForm.address,
      identityDocument: inscForm.identityDocument,
      registrationDate: today(),
    }

    addInscription(inscription)
    setInscForm(emptyForm)
    showToast('Candidato inscrito com sucesso.', 'success')
  }

  // Calculation for payments
  const discountAmount = (enrollmentData.propinaValue * enrollmentData.discountPercent) / 100
  const propinaDiscounted = enrollmentData.propinaValue - discountAmount
  const paidNowValue = enrollmentData.matriculaValue + propinaDiscounted
  const totalPropinaAnual = propinaDiscounted * enrollmentData.installments
  const pendingBalanceValue = totalPropinaAnual - propinaDiscounted

  // RENDER PORTAL DE MATRÍCULAS (LIST OF APPLICATIONS & RESUME DRAFT OPTIONS)
  if (currentAction === 'matriculas' && currentStepIndex === 0 && !enrollmentData.fullName && data.enrollmentApplications.length > 0) {
    const savedDraft = localStorage.getItem('kitanda_enrollment_draft')
    let draftPercentage = 0
    let draftName = ''
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        draftName = parsed.data?.fullName || 'Estudante Sem Nome'
        draftPercentage = Math.round(((parsed.stepIndex + 1) / 7) * 100)
      } catch (e) {}
    }

    return (
      <div className="space-y-6 page-swap">
        <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-600">Portal Académico</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Portal de Matrículas</h1>
          <p className="mt-1 text-kitanda-muted">Acompanhe as matrículas progressivas e inicie novas admissões.</p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm">
            <p className="text-xs text-kitanda-muted">Matrículas Efetuadas</p>
            <p className="text-2xl font-bold text-gray-900">{data.enrollmentApplications.length}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">[OK] Alunos Ativos</span>
          </div>
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm">
            <p className="text-xs text-kitanda-muted">Vagas Totais</p>
            <p className="text-2xl font-bold text-gray-900">125</p>
            <span className="text-[11px] text-kitanda-muted">Preenchimento progressivo</span>
          </div>
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm">
            <p className="text-xs text-kitanda-muted">Taxa de Ocupação</p>
            <p className="text-2xl font-bold text-gray-900">76%</p>
            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '76%' }} />
            </div>
          </div>
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm flex flex-col justify-center">
            <button
              onClick={() => {
                setEnrollmentData(initialEnrollmentData)
                setCurrentStepIndex(0)
                // Force wizard start
                setEnrollmentData(prev => ({ ...prev, fullName: ' ' }))
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all"
            >
              <i className="bi bi-plus-circle-fill mr-2" />
              Nova Matrícula Step-by-Step
            </button>
          </div>
        </div>

        {/* RESUME DRAFT BANNER */}
        {savedDraft && draftPercentage > 0 && (
          <div className="rounded-18 border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
                <i className="bi bi-file-earmark-diff" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Rascunho de Matrícula Pendente</h4>
                <p className="text-xs text-kitanda-muted">Estudante: <span className="font-semibold">{draftName}</span> • Progresso: {draftPercentage}%</p>
                <p className="text-xs text-emerald-700 mt-0.5">{getVisualProgress(Math.floor(draftPercentage / 15))}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(savedDraft)
                    setEnrollmentData(parsed.data)
                    setCurrentStepIndex(parsed.stepIndex)
                  } catch (e) {}
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700"
              >
                Continuar Rascunho
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('kitanda_enrollment_draft')
                  resetEnrollmentWizard()
                  setEnrollmentData(prev => ({ ...prev, fullName: ' ' }))
                  showToast('Rascunho descartado.', 'info')
                }}
                className="px-4 py-2 border border-red-200 text-red-600 font-semibold text-xs rounded-lg hover:bg-red-50"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {/* HISTORY LIST */}
        <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico de Admissões Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-semibold text-kitanda-muted">
                  <th className="px-4 py-3">Estudante</th>
                  <th className="px-4 py-3">Curso</th>
                  <th className="px-4 py-3">Campus</th>
                  <th className="px-4 py-3">Finanças</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.enrollmentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <img src={app.photo} alt="" className="h-8 w-8 rounded-full object-cover border border-gray-100" />
                      <div>
                      <p className="font-semibold text-gray-900">{app.fullName}</p>
                      <p className="text-[10px] text-kitanda-muted">{app.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 font-medium">{app.course}</td>
                  <td className="px-4 py-3.5 text-gray-500">{app.campus || 'Campus Central'}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{app.financial?.matriculaValue + app.financial?.propinaValue} Kz</p>
                    <span className="text-[10px] text-emerald-600 font-medium">[OK] Pago</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{app.createdAt}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      MATRICULADO
                    </span>
                  </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // WIZARD RENDER (STEP-BY-STEP ENROLLMENT)
  if (currentAction === 'matriculas') {
    const isUnderage = calculateAge(enrollmentData.birthDate) < 18
    const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100)

    return (
      <div className="space-y-6 page-swap">
        
        {/* WIZARD HEADER */}
        <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Onboarding e Matrícula Progressiva</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Ficha de Admissão Digital</h1>
            <p className="text-sm text-kitanda-muted mt-1">Conclua cada etapa com rigor para criar as credenciais académicas.</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
              {getVisualProgress(currentStepIndex)}
            </span>
            <span className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              (Salvo) Alterações salvas em tempo real
            </span>
          </div>
        </div>

        {/* GRID LAYOUT: LEFT STEPS LIST, RIGHT FORM */}
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          
          {/* STEPPER STATUS SIDEBAR */}
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-3 h-fit">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b pb-2 mb-4">Etapas do Processo</p>
            {steps.map((st, sIdx) => {
              const isActive = sIdx === currentStepIndex
              const isCompleted = sIdx < currentStepIndex || generatedCodes !== null
              const isFuture = sIdx > currentStepIndex && generatedCodes === null

              let badgeClass = "bg-gray-100 text-gray-500"
              if (isActive) badgeClass = "bg-emerald-600 text-white shadow-md shadow-emerald-200"
              if (isCompleted) badgeClass = "bg-emerald-100 text-emerald-700"

              return (
                <button
                  key={st.label}
                  disabled={isFuture || generatedCodes !== null}
                  onClick={() => setCurrentStepIndex(sIdx)}
                  className={`w-full text-left flex items-center gap-3.5 p-2.5 rounded-xl transition-all ${
                    isActive ? 'bg-slate-50 border-l-4 border-emerald-600 pl-2' : 'hover:bg-slate-50'
                  } ${isFuture ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold ${badgeClass}`}>
                    {isCompleted ? <i className="bi bi-check-lg" /> : sIdx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{st.label}</p>
                    <p className="text-[10px] text-kitanda-muted truncate">{st.desc}</p>
                  </div>
                </button>
              )
            })}

            {/* EXIT / SAVE BUTTONS */}
            <div className="pt-4 border-t mt-4 space-y-2">
              <button
                onClick={() => {
                  showToast('O seu progresso foi salvo com segurança.', 'success')
                  setCurrentAction('inscricao')
                }}
                className="w-full py-2 border border-gray-200 text-gray-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <i className="bi bi-save" />
                Salvar e Sair
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Tem a certeza que deseja cancelar? O rascunho atual será eliminado.')) {
                    resetEnrollmentWizard()
                    showToast('Matrícula cancelada.', 'info')
                  }
                }}
                className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <i className="bi bi-trash" />
                Descartar Rascunho
              </button>
            </div>
          </div>

          {/* MAIN STEP FORM AREA */}
          <div className="space-y-6">
            
            {/* ERROR BANNER IF PRESENT */}
            {!generatedCodes && currentStepErrors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <i className="bi bi-exclamation-octagon-fill" />
                  Corrija as inconsistências para poder prosseguir:
                </p>
                <ul className="mt-1.5 list-disc pl-5 text-xs text-red-700 space-y-1">
                  {currentStepErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* STEP 1: DADOS PESSOAIS */}
            {currentStepIndex === 0 && (
              <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-6 animate-fadeInUp">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-gray-900">Etapa 1: Dados Pessoais</h3>
                  <p className="text-xs text-kitanda-muted mt-0.5">Preencha os campos com os dados de identificação civil.</p>
                </div>

                {/* Photo and Avatar Section */}
                <div className="grid gap-6 md:grid-cols-[130px_1fr] items-center">
                  <div className="relative group mx-auto md:mx-0">
                    <img src={enrollmentData.photo} alt="Foto do Estudante" className="h-28 w-28 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow hover:scale-105 transition-transform"
                    >
                      <i className="bi bi-camera-fill text-sm" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleCustomPhoto} accept="image/*" className="hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Selecione uma Foto Oficial ou Carregue Customizada</label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.name}
                          type="button"
                          onClick={() => setEnrollmentData(prev => ({ ...prev, photo: av.url }))}
                          className={`p-1.5 rounded-xl border transition-all hover:scale-105 ${
                            enrollmentData.photo === av.url ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <img src={av.url} alt="" className="h-10 w-10 rounded-full object-cover" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-[54px] px-3 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600"
                      >
                        <i className="bi bi-upload text-sm" />
                        Carregar Ficheiro
                      </button>
                    </div>
                  </div>
                </div>

                {/* Standard Inputs */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nome Completo (Conforme BI) *</span>
                    <input
                      type="text"
                      required
                      value={enrollmentData.fullName}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Ex: Manuel António da Silva"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Data de Nascimento *</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "w-full flex items-center rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30",
                            !enrollmentData.birthDate && "text-gray-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {enrollmentData.birthDate ? format(new Date(enrollmentData.birthDate), "PPP") : <span>Escolha uma data</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CustomCalendar 
                          selectedDate={enrollmentData.birthDate ? new Date(enrollmentData.birthDate) : undefined} 
                          onSelectDate={(date) => setEnrollmentData(prev => ({ ...prev, birthDate: date ? date.toISOString().split('T')[0] : '' }))} 
                        />
                      </PopoverContent>
                    </Popover>
                  </label>

                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-gray-700">Gênero *</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Masculino"
                          checked={enrollmentData.gender === "Masculino"}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, gender: e.target.value }))}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Masculino</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Feminino"
                          checked={enrollmentData.gender === "Feminino"}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, gender: e.target.value }))}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Feminino</span>
                      </label>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nacionalidade *</span>
                    <input
                      type="text"
                      required
                      value={enrollmentData.nationality}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Ex: Angolana"
                    />
                  </label>

                  <CustomSelect
                    label="Estado Civil *"
                    value={enrollmentData.maritalStatus}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, maritalStatus: val }))}
                    options={[
                      { label: "Selecionar", value: "" },
                      { label: "Solteiro(a)", value: "Solteiro(a)" },
                      { label: "Casado(a)", value: "Casado(a)" },
                      { label: "Divorciado(a)", value: "Divorciado(a)" },
                      { label: "Viúvo(a)", value: "Viúvo(a)" },
                    ]}
                  />

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Telefone Móvel *</span>
                    <input
                      type="tel"
                      required
                      value={enrollmentData.phone}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Ex: 923456789"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Email Académico / Pessoal *</span>
                    <input
                      type="email"
                      required
                      value={enrollmentData.email}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Ex: manuel.silva@escola.ao"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Endereço de Residência *</span>
                    <input
                      type="text"
                      required
                      value={enrollmentData.address}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Bairro, Rua, Casa Nº"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: DOCUMENTOS */}
            {currentStepIndex === 1 && (
              <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-6 animate-fadeInUp">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-gray-900">Etapa 2: Documentos e Arquivos</h3>
                  <p className="text-xs text-kitanda-muted mt-0.5">Faça o upload dos documentos oficiais exigidos institucionalmente.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <CustomSelect
                    label="Tipo de Documento Principal"
                    value={enrollmentData.identityType}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, identityType: val as 'BI' | 'PASSAPORTE' }))}
                    options={[
                      { label: "Bilhete de Identidade (BI)", value: "BI" },
                      { label: "Passaporte", value: "PASSAPORTE" },
                    ]}
                  />

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Número do Documento (BI / Passaporte) *</span>
                    <input
                      type="text"
                      required
                      value={enrollmentData.identityNumber}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, identityNumber: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Ex: 004123567LA045"
                    />
                  </label>
                </div>

                {/* File Upload Zone */}
                <div className="border-2 border-dashed border-gray-200 rounded-18 p-6 text-center space-y-4 bg-slate-50">
                  <div className="flex justify-center text-slate-400 text-3xl">
                    <i className="bi bi-cloud-arrow-up" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Carregar Novo Documento Digitalizado</h4>
                    <p className="text-xs text-kitanda-muted mt-1">Selecione o tipo de arquivo e anexe. São aceites formatos PDF, PNG, JPG (máx. 10MB).</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {(['BI', 'Certificado', 'Residência'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setUploadCategory(cat)
                          docInputRef.current?.click()
                        }}
                        className="px-3.5 py-2 bg-white border border-gray-200 hover:border-emerald-500 text-xs font-semibold text-slate-700 rounded-xl flex items-center gap-1 shadow-sm transition-all"
                      >
                        <i className="bi bi-file-earmark-plus" />
                        Anexar {cat === 'BI' ? 'BI/Passaporte' : cat === 'Certificado' ? 'Certificado' : 'Comprovativo Residência'}
                      </button>
                    ))}
                  </div>
                  <input type="file" ref={docInputRef} onChange={handleDocumentSelect} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                </div>

                {/* Uploaded Files Progress & List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Documentação Carregada:</h4>
                  {enrollmentData.uploadedFiles.length === 0 ? (
                    <div className="text-center p-6 border rounded-xl text-xs text-kitanda-muted bg-slate-50/50">
                      Nenhum ficheiro anexado. Utilize os botões acima para simular o upload dos documentos obrigatórios.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {enrollmentData.uploadedFiles.map((file) => (
                        <div key={file.id} className="p-3 border rounded-xl flex items-center justify-between gap-4 bg-white shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg">
                              <i className={file.category === 'BI' ? 'bi-person-vcard' : 'bi-file-earmark-text'} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{file.name}</p>
                              <p className="text-[10px] text-kitanda-muted">{file.size} • <span className="uppercase text-emerald-600 font-bold">{file.category}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {file.status === 'uploading' ? (
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${file.progress}%` }} />
                                </div>
                                <span className="text-[10px] text-kitanda-muted font-mono">{file.progress}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                <i className="bi bi-check-circle-fill" /> Valido
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEnrollmentData(prev => ({
                                  ...prev,
                                  uploadedFiles: prev.uploadedFiles.filter(f => f.id !== file.id)
                                }))
                                showToast('Ficheiro removido.', 'info')
                              }}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg text-sm transition-colors"
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mandatory Checklist indicators */}
                <div className="p-4 rounded-xl bg-slate-50 border space-y-1 text-xs">
                  <p className="font-bold text-gray-700">Estado de validação das cópias:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className={`bi ${enrollmentData.uploadedFiles.some(f => f.category === 'BI') ? 'bi-check-circle-fill text-emerald-600' : 'bi-x-circle-fill text-red-500'}`} />
                      BI/Passaporte
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className={`bi ${enrollmentData.uploadedFiles.some(f => f.category === 'Certificado') ? 'bi-check-circle-fill text-emerald-600' : 'bi-x-circle-fill text-red-500'}`} />
                      Certificado Escolar
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className={`bi ${enrollmentData.uploadedFiles.some(f => f.category === 'Residência') ? 'bi-check-circle-fill text-emerald-600' : 'bi-x-circle-fill text-red-500'}`} />
                      Comprovativo Residência
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DADOS ACADÉMICOS */}
            {currentStepIndex === 2 && (
              <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-6 animate-fadeInUp">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-gray-900">Etapa 3: Seleção Académica</h3>
                  <p className="text-xs text-kitanda-muted mt-0.5">Indique o plano de estudos, turno e turma para o ano letivo.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <CustomSelect
                    label="Curso Pretendido *"
                    value={enrollmentData.course}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, course: val }))}
                    options={[
                      { label: "Selecionar Curso", value: "" },
                      ...COURSES_LIST.map(c => ({ label: c.name, value: c.name }))
                    ]}
                  />

                  <CustomSelect
                    label="Ano / Classe *"
                    value={enrollmentData.classYear}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, classYear: val }))}
                    options={[
                      { label: "1º Ano", value: "1º Ano" },
                      { label: "2º Ano", value: "2º Ano" },
                      { label: "3º Ano", value: "3º Ano" },
                      { label: "4º Ano", value: "4º Ano" },
                      { label: "5º Ano", value: "5º Ano" },
                    ]}
                  />

                  <CustomSelect
                    label="Turno de Aulas *"
                    value={enrollmentData.shift}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, shift: val }))}
                    options={[
                      { label: "Selecionar Turno", value: "" },
                      { label: "Manhã (07:30 - 12:30)", value: "Manhã" },
                      { label: "Tarde (13:00 - 18:00)", value: "Tarde" },
                      { label: "Noite (18:30 - 22:30)", value: "Noite" },
                    ]}
                  />

                  <CustomSelect
                    label="Turma Designada *"
                    value={enrollmentData.turma}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, turma: val }))}
                    options={[
                      { label: "Selecionar Turma", value: "" },
                      { label: "Turma A", value: "Turma A" },
                      { label: "Turma B", value: "Turma B" },
                      { label: "Turma C", value: "Turma C" },
                    ]}
                  />

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Campus Universitário</span>
                    <input
                      type="text"
                      readOnly
                      value={enrollmentData.campus || 'Campus Central'}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
                    />
                  </label>

                  <CustomSelect
                    label="Modalidade de Ensino *"
                    value={enrollmentData.modality}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, modality: val }))}
                    options={[
                      { label: "Presencial", value: "Presencial" },
                      { label: "Ensino a Distância (EAD)", value: "EAD" },
                      { label: "Ensino Híbrido", value: "Híbrido" },
                    ]}
                  />
                </div>

                {/* Real-time Vacancies Card indicator */}
                {enrollmentData.course && enrollmentData.shift && enrollmentData.turma && (() => {
                  const vac = getVacancies(enrollmentData.course, enrollmentData.shift, enrollmentData.turma)
                  const isFull = vac.filled >= vac.total
                  return (
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                      isFull ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                          isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <i className={isFull ? 'bi-shield-fill-x' : 'bi-shield-fill-check'} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">Disponibilidade de Vagas</p>
                          <p className="text-sm font-semibold">{vac.total - vac.filled} de {vac.total} vagas restantes nesta turma</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isFull ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'
                      }`}>
                        {isFull ? 'ESGOTADA' : 'VAGAS DISPONÍVEIS'}
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* STEP 4: DADOS FINANCEIROS */}
            {currentStepIndex === 3 && (
              <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-6 animate-fadeInUp">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-gray-900">Etapa 4: Situação Financeira</h3>
                  <p className="text-xs text-kitanda-muted mt-0.5">Determine o plano de propina, descontos/bolsa e envie o comprovativo.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Valor de Matrícula (Kz)</span>
                    <input
                      type="number"
                      readOnly
                      value={enrollmentData.matriculaValue}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Mensalidade / Propina Base (Kz)</span>
                    <input
                      type="number"
                      readOnly
                      value={enrollmentData.propinaValue}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </label>

                  <CustomSelect
                    label="Plano de Desconto / Bolsa (%)"
                    value={String(enrollmentData.discountPercent)}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, discountPercent: Number(val) }))}
                    options={[
                      { label: "Sem desconto (0%)", value: "0" },
                      { label: "Desconto Comercial / Familiar (10%)", value: "10" },
                      { label: "Meio de Bolsa Parcial (25%)", value: "25" },
                      { label: "Bolsa de Mérito Académico (50%)", value: "50" },
                      { label: "Bolsa Integral / Isento (100%)", value: "100" },
                    ]}
                  />

                  <CustomSelect
                    label="Método de Pagamento Utilizado *"
                    value={enrollmentData.paymentMethod}
                    onChange={(val) => setEnrollmentData(prev => ({ ...prev, paymentMethod: val }))}
                    options={[
                      { label: "Selecionar Método", value: "" },
                      { label: "Transferência Bancária", value: "Transferência Bancária" },
                      { label: "Depósito Bancário", value: "Depósito Bancário" },
                      { label: "Multicaixa Express", value: "Multicaixa Express" },
                      { label: "Dinheiro Físico", value: "Dinheiro Físico" },
                    ]}
                  />

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nº de Comprovativo ou ID de Transação *</span>
                    <input
                      type="text"
                      required
                      value={enrollmentData.paymentReference}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, paymentReference: e.target.value }))}
                      className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="Nº da operação bancária ou talão"
                    />
                  </label>

                  <div className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700">Anexar Comprovativo de Pagamento *</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={enrollmentData.paymentProofName || 'Nenhum ficheiro anexado'}
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
                              setEnrollmentData(prev => ({ ...prev, paymentProofName: file.name }))
                              showToast('Recibo bancário anexado!', 'success')
                            }
                          }
                          inp.click()
                        }}
                        className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all"
                      >
                        Carregar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial Summary Card */}
                <div className="rounded-18 bg-slate-900 text-white p-5 space-y-4 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-400">Extrato Financeiro Previsto</p>
                    <i className="bi bi-receipt text-emerald-400 text-xl" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Matrícula:</span>
                      <span className="font-mono font-bold">{enrollmentData.matriculaValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Propina (Mensal):</span>
                      <span className="font-mono font-bold">{enrollmentData.propinaValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                    {enrollmentData.discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Bolsa/Desconto Aplicado ({enrollmentData.discountPercent}%):</span>
                        <span className="font-mono font-bold">-{discountAmount.toLocaleString('pt-PT')} Kz</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                      <span className="text-slate-300 font-bold">Total Pago Agora (Matrícula + 1ª Mensalidade):</span>
                      <span className="font-mono font-bold text-emerald-400">{paidNowValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Parcelas Restantes (9 parcelas):</span>
                      <span className="font-mono">{pendingBalanceValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: RESPONSÁVEL / ENCARREGADO DE EDUCAÇÃO */}
            {currentStepIndex === 4 && (
              <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-6 animate-fadeInUp">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-gray-900">Etapa 5: Responsável Legal</h3>
                  <p className="text-xs text-kitanda-muted mt-0.5">Identifique o Encarregado de Educação para acompanhamento do rendimento académico.</p>
                </div>

                {/* Age notification */}
                {(() => {
                  const age = calculateAge(enrollmentData.birthDate)
                  return (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                      isUnderage ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-gray-200 text-slate-700'
                    }`}>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                        isUnderage ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <i className={isUnderage ? 'bi-exclamation-triangle-fill' : 'bi-shield-check'} />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold">Idade Detetada: {age} anos</p>
                        <p>{isUnderage 
                          ? 'Estudante menor de idade! A indicação de um Encarregado é legalmente OBRIGATÓRIA.' 
                          : 'Estudante maior de idade! O preenchimento destes dados é OPCIONAL.'}
                        </p>
                      </div>
                    </div>
                  )
                })()}

                {/* Toggle for adults */}
                {!isUnderage && (
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer p-2 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      checked={enrollmentData.hasGuardian}
                      onChange={(e) => setEnrollmentData(prev => ({ ...prev, hasGuardian: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Preencher dados do Encarregado de Educação (Opcional)
                  </label>
                )}

                {(isUnderage || enrollmentData.hasGuardian) && (
                  <div className="grid gap-4 md:grid-cols-2 animate-fadeInUp">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nome do Responsável *</span>
                      <input
                        type="text"
                        required
                        value={enrollmentData.guardianName}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, guardianName: e.target.value }))}
                        className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Ex: Pedro Miguel da Silva"
                      />
                    </label>

                    <CustomSelect
                      label="Grau de Parentesco *"
                      value={enrollmentData.guardianRelation}
                      onChange={(val) => setEnrollmentData(prev => ({ ...prev, guardianRelation: val }))}
                      options={[
                        { label: "Selecionar", value: "" },
                        { label: "Pai", value: "Pai" },
                        { label: "Mãe", value: "Mãe" },
                        { label: "Tio/a", value: "Tio/a" },
                        { label: "Irmão/ã", value: "Irmão/ã" },
                        { label: "Tutor/a Legal", value: "Tutor/a" },
                      ]}
                    />

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-gray-700">Telefone do Responsável *</span>
                      <input
                        type="tel"
                        required
                        value={enrollmentData.guardianPhone}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                        className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Ex: 934567123"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-gray-700">Email de Contacto (Opcional)</span>
                      <input
                        type="email"
                        value={enrollmentData.guardianEmail}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, guardianEmail: e.target.value }))}
                        className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Ex: pedro.silva@gmail.com"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold text-gray-700">Endereço de Residência do Responsável *</span>
                      <input
                        type="text"
                        required
                        value={enrollmentData.guardianAddress}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, guardianAddress: e.target.value }))}
                        className="w-full rounded-xl border border-kitanda-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Endereço completo"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: REVISÃO FINAL */}
            {currentStepIndex === 5 && (
              <div className="space-y-6 animate-fadeInUp">
                
                <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm">
                  <div className="border-b pb-3">
                    <h3 className="text-base font-bold text-gray-900">Etapa 6: Revisão Final dos Dados</h3>
                    <p className="text-xs text-kitanda-muted mt-0.5">Reveja atentamente todas as informações antes de oficializar a matrícula escolar.</p>
                  </div>
                </div>

                {/* Personal summary card */}
                <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <i className="bi bi-person text-emerald-600 text-lg" />
                      1. Informação Pessoal
                    </h4>
                    <button onClick={() => setCurrentStepIndex(0)} className="text-xs font-semibold text-emerald-600 hover:underline">
                      <i className="bi bi-pencil mr-1" /> Editar
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 items-center">
                    <img src={enrollmentData.photo} alt="" className="h-20 w-20 rounded-full object-cover border mx-auto md:mx-0" />
                    <div className="text-xs space-y-1.5 md:col-span-2">
                      <p><span className="text-slate-500">Nome:</span> <span className="font-bold text-gray-900">{enrollmentData.fullName}</span></p>
                      <p><span className="text-slate-500">Nascimento:</span> <span className="font-semibold">{enrollmentData.birthDate} ({calculateAge(enrollmentData.birthDate)} anos)</span></p>
                      <p><span className="text-slate-500">Contacto:</span> <span className="font-semibold">{enrollmentData.phone} | {enrollmentData.email}</span></p>
                      <p><span className="text-slate-500">Morada:</span> <span className="text-gray-700">{enrollmentData.address}</span></p>
                    </div>
                  </div>
                </div>

                {/* Documents Summary Card */}
                <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <i className="bi bi-file-earmark-check text-emerald-600 text-lg" />
                      2. Identificação & Documentos
                    </h4>
                    <button onClick={() => setCurrentStepIndex(1)} className="text-xs font-semibold text-emerald-600 hover:underline">
                      <i className="bi bi-pencil mr-1" /> Editar
                    </button>
                  </div>
                  <div className="text-xs space-y-2">
                    <p><span className="text-slate-500">Nº do Documento ({enrollmentData.identityType}):</span> <span className="font-bold font-mono text-gray-900">{enrollmentData.identityNumber}</span></p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {enrollmentData.uploadedFiles.map(file => (
                      <span key={file.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold">
                        [OK] {file.category}: {file.name}
                      </span>

                      ))}
                    </div>
                  </div>
                </div>

                {/* Academic Summary Card */}
                <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <i className="bi bi-mortarboard text-emerald-600 text-lg" />
                      3. Escolha de Turno & Turma
                    </h4>
                    <button onClick={() => setCurrentStepIndex(2)} className="text-xs font-semibold text-emerald-600 hover:underline">
                      <i className="bi bi-pencil mr-1" /> Editar
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3 text-xs">
                    <div>
                      <p className="text-slate-500">Curso:</p>
                      <p className="font-bold text-gray-900">{enrollmentData.course}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Ano/Classe:</p>
                      <p className="font-bold text-gray-900">{enrollmentData.classYear}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Turno & Turma:</p>
                      <p className="font-bold text-gray-900">{enrollmentData.shift} • {enrollmentData.turma}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary Card */}
                <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <i className="bi bi-credit-card text-emerald-600 text-lg" />
                      4. Situação Financeira & Pagamento
                    </h4>
                    <button onClick={() => setCurrentStepIndex(3)} className="text-xs font-semibold text-emerald-600 hover:underline">
                      <i className="bi bi-pencil mr-1" /> Editar
                    </button>
                  </div>
                  <div className="text-xs grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <p><span className="text-slate-500">Método:</span> <span className="font-semibold">{enrollmentData.paymentMethod}</span></p>
                      <p><span className="text-slate-500">Ref / Comprovativo:</span> <span className="font-mono font-bold">{enrollmentData.paymentReference}</span></p>
                      <p><span className="text-slate-500">Ficheiro Comprovativo:</span> <span className="text-slate-600 font-semibold">{enrollmentData.paymentProofName}</span></p>
                    </div>
                    <div className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Total Pago Agora:</span>
                        <span className="text-emerald-700">{paidNowValue.toLocaleString('pt-PT')} Kz</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Restante Propina (9x):</span>
                        <span>{pendingBalanceValue.toLocaleString('pt-PT')} Kz</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guardian Summary Card */}
                {(isUnderage || enrollmentData.hasGuardian) && (
                  <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <i className="bi bi-people text-emerald-600 text-lg" />
                        5. Responsável Legal
                      </h4>
                      <button onClick={() => setCurrentStepIndex(4)} className="text-xs font-semibold text-emerald-600 hover:underline">
                        <i className="bi bi-pencil mr-1" /> Editar
                      </button>
                    </div>
                    <div className="text-xs grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-slate-500">Nome:</p>
                        <p className="font-bold text-gray-900">{enrollmentData.guardianName} ({enrollmentData.guardianRelation})</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Contacto:</p>
                        <p className="font-semibold text-gray-900">{enrollmentData.guardianPhone} | {enrollmentData.guardianEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final consent before confirmation */}
                <div className="rounded-18 bg-emerald-50 border border-emerald-100 p-5 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <i className="bi bi-shield-lock-fill" /> Termos de Responsabilidade
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Ao confirmar a matrícula, o sistema irá gerar automaticamente as vossas credenciais académicas,
                    além de atualizar as vagas nas turmas e cadastrar o aluno ativo na base de dados geral institucional.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 7: CONFIRMAÇÃO DE MATRÍCULA (SUCCESS VIEW) */}
            {currentStepIndex === 6 && generatedCodes && (
              <div className="space-y-6 animate-fadeInUp">
                
                {/* Celebratory Banner */}
                <div className="rounded-18 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-8 text-center space-y-3 shadow-xl">
                  <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                    <i className="bi bi-check-all animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black">Matrícula Efetuada com Sucesso!</h2>
                  <p className="text-xs text-emerald-100 max-w-md mx-auto">Registo institucional e credenciais geradas. O estudante foi oficialmente integrado na lista de Alunos Ativos.</p>
                  
                    <div className="flex justify-center gap-3 pt-2">
                      <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">[OK] MATRICULADO</span>
                      <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">[OK] ALUNO ATIVO</span>
                    </div>

                </div>

                {/* DIGITAL ID CARD PREVIEW */}
                <div className="max-w-md mx-auto rounded-2xl bg-kitanda-sidebar text-white border border-slate-800 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  
                  {/* ID Header */}
                  <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center">
                        <i className="bi bi-mortarboard-fill text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider">Escola Kitanda</p>
                        <p className="text-[9px] text-slate-400">Cartão de Estudante Digital</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-bold">ALUNO ATIVO</span>
                  </div>

                  {/* ID Body */}
                  <div className="p-6 flex gap-5 items-center">
                    <img src={enrollmentData.photo} alt="" className="h-24 w-24 rounded-xl object-cover border-2 border-slate-700 shadow-lg shrink-0" />
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="text-sm font-black truncate">{enrollmentData.fullName}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{enrollmentData.course}</p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[10px] text-slate-400">
                        <div>
                          <span className="block text-[8px] uppercase tracking-widest text-slate-500">Nº Estudante</span>
                          <span className="font-bold text-white font-mono">{generatedCodes.studentNumber}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-widest text-slate-500">Cód. Académico</span>
                          <span className="font-bold text-white font-mono">{generatedCodes.academicCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ID Footer */}
                  <div className="bg-slate-900/60 p-4 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <i className="bi bi-qr-code text-xl text-emerald-400" />
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-slate-500">Nº Matrícula</p>
                        <p className="font-mono text-white font-bold">{generatedCodes.enrollmentNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase tracking-widest text-slate-500">Ano Académico</p>
                      <p className="text-white font-bold">2026</p>
                    </div>
                  </div>
                </div>

                {/* INVOICE / RECEIPT SUMMARY */}
                <div className="rounded-18 border border-kitanda-border bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Comprovativo de Matrícula & Operações Financeiras</h3>
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-2">
                      <p><span className="text-slate-500">Beneficiário:</span> <span className="font-bold text-gray-900">{enrollmentData.fullName}</span></p>
                      <p><span className="text-slate-500">Curso:</span> <span className="font-semibold">{enrollmentData.course}</span></p>
                      <p><span className="text-slate-500">Turno & Turma:</span> <span className="font-semibold">{enrollmentData.shift} • {enrollmentData.turma}</span></p>
                    </div>
                    <div className="space-y-2 text-right sm:text-left">
                      <p><span className="text-slate-500">Código de Recibo:</span> <span className="font-bold text-gray-900 font-mono">REC-2026-{(Math.floor(10000 + Math.random() * 90000))}</span></p>
                      <p><span className="text-slate-500">Método de Liquidação:</span> <span className="font-semibold">{enrollmentData.paymentMethod}</span></p>
                      <p><span className="text-slate-500">Referência do Pagamento:</span> <span className="font-mono font-bold text-emerald-600">{enrollmentData.paymentReference}</span></p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inscrição & Taxa de Matrícula:</span>
                      <span className="font-mono font-semibold">{enrollmentData.matriculaValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">1ª Parcela Mensalidade (com {enrollmentData.discountPercent}% desconto):</span>
                      <span className="font-mono font-semibold">{propinaDiscounted.toLocaleString('pt-PT')} Kz</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-sm">
                      <span className="text-gray-900">Total Liquidado Agora:</span>
                      <span className="text-emerald-700">{paidNowValue.toLocaleString('pt-PT')} Kz</span>
                    </div>
                  </div>

                  {/* Print & Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        window.print()
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-all"
                    >
                      <i className="bi bi-printer" />
                      Imprimir Ficha de Matrícula
                    </button>
                    <button
                      onClick={resetEnrollmentWizard}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5 transition-all"
                    >
                      <i className="bi bi-arrow-repeat" />
                      Efectuar Nova Matrícula
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            {!generatedCodes && (
              <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="rounded-xl border border-gray-200 hover:bg-slate-50 px-6 py-2.5 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  <i className="bi bi-arrow-left mr-1" /> Anterior
                </button>

                {currentStepIndex < steps.length - 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white flex items-center gap-1 shadow-sm transition-all"
                  >
                    Próximo <i className="bi bi-arrow-right ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
                  >
                    <i className="bi bi-shield-check" /> Confirmar & Finalizar Matrícula
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    )
  }

  // RENDER NORMAL PRE-REGISTRATION / INSCRIPTION PAGE
  return (
    <div className="space-y-6 page-swap">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-600">Portal Académico</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="mt-1 text-kitanda-muted">Pré-admissão, matrícula progressiva e alunos ativos.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEnrollmentData(initialEnrollmentData)
              setCurrentStepIndex(0)
              setCurrentAction('matriculas')
            }}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <i className="bi bi-plus-circle" /> Nova Matrícula Step-by-Step
          </button>
          <div className="rounded-18 border border-kitanda-border bg-white px-4 py-3 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] text-kitanda-muted leading-none">Inscrições</p>
            <p className="text-lg font-bold text-gray-900 leading-none mt-1">{data.inscriptions.length}</p>
          </div>
          <div className="rounded-18 border border-kitanda-border bg-white px-4 py-3 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] text-kitanda-muted leading-none">Alunos Ativos</p>
            <p className="text-lg font-bold text-gray-900 leading-none mt-1">{data.students.length}</p>
          </div>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setStudentTab('inscricao')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${studentTab === 'inscricao' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted hover:text-gray-900'}`}
        >
          <i className="bi bi-pen-fill mr-1" /> Pré-Cadastro
        </button>
        <button
          onClick={() => setStudentTab('alunos')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${studentTab === 'alunos' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-kitanda-muted hover:text-gray-900'}`}
        >
          <i className="bi bi-people-fill mr-1" /> Alunos Ativos ({data.students.length})
        </button>
      </div>

      {studentTab === 'inscricao' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
          
          {/* Candidate Inscription Form */}
          <form onSubmit={handleInscSubmit} className="grid gap-4 rounded-18 border border-kitanda-border bg-white p-5 shadow-sm md:grid-cols-2">
            <div className="md:col-span-2 rounded-18 bg-emerald-50/50 border border-emerald-100 p-4">
              <p className="text-sm font-semibold text-emerald-800">Formulário Inicial de Candidatura</p>
              <p className="mt-1 text-xs text-emerald-700">Recolha os dados de interesse. O candidato poderá ser matriculado step-by-step posteriormente.</p>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nome completo *</span>
              <input
                type="text" required value={inscForm.fullName}
                onChange={(e) => setInscForm({ ...inscForm, fullName: e.target.value })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                placeholder="Ex: Manuel Silva"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Telefone *</span>
              <input
                type="tel" required value={inscForm.phone}
                onChange={(e) => setInscForm({ ...inscForm, phone: e.target.value })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                placeholder="Ex: 923123456"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Email</span>
              <input
                type="email" value={inscForm.email}
                onChange={(e) => setInscForm({ ...inscForm, email: e.target.value })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                placeholder="Ex: candidato@gmail.com"
              />
            </label>

            <DatePickerField
              label="Data de nascimento"
              value={inscForm.birthDate}
              onChange={(iso) => setInscForm({ ...inscForm, birthDate: iso })}
              startMonth={new Date(1960, 0)}
              endMonth={new Date()}
            />

            <CustomSelect
              label="Gênero"
              value={inscForm.gender}
              onChange={(val) => setInscForm({ ...inscForm, gender: val })}
              options={[
                { label: "Selecionar", value: "" },
                { label: "Feminino", value: "Feminino" },
                { label: "Masculino", value: "Masculino" },
              ]}
            />

            <CustomSelect
              label="Curso de interesse *"
              value={inscForm.courseInterest}
              onChange={(val) => setInscForm({ ...inscForm, courseInterest: val })}
              options={[
                { label: "Selecionar", value: "" },
                ...COURSES_LIST.map(c => ({ label: c.name, value: c.name }))
              ]}
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Nível académico</span>
              <input
                type="text" value={inscForm.academicLevel}
                onChange={(e) => setInscForm({ ...inscForm, academicLevel: e.target.value })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                placeholder="Ex: Ensino Médio"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Endereço</span>
              <input
                type="text" value={inscForm.address}
                onChange={(e) => setInscForm({ ...inscForm, address: e.target.value })}
                className="w-full rounded-xl border border-kitanda-border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
                placeholder="Bairro, Morada"
              />
            </label>

            <div className="md:col-span-2">
              <button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition-opacity" type="submit">
                Guardar Candidatura
              </button>
            </div>
          </form>

          {/* Candidate Inscriptions list */}
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Fila de Pré-Admissão</h2>
            <div className="space-y-3">
              {data.inscriptions.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-12 text-center text-sm text-kitanda-muted">Nenhum candidato na fila de pré-admissão.</p>
              ) : (
                data.inscriptions.map((item) => (
                  <div key={item.id} className="rounded-xl border border-kitanda-border p-4 hover:border-emerald-300 transition-colors bg-slate-50/20">
                    <p className="font-semibold text-gray-900">{item.fullName}</p>
                    <p className="mt-1 text-xs text-kitanda-muted"><span className="font-bold">Interesse:</span> {item.courseInterest}</p>
                    <p className="text-xs text-kitanda-muted"><span className="font-bold">Contacto:</span> {item.phone} | {item.email || 'N/A'}</p>
                    <p className="text-[10px] text-kitanda-muted mt-2">Registado a: {item.registrationDate}</p>
                    
                    <button
                      onClick={() => handlePromoteCandidate(item)}
                      className="mt-3 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <i className="bi bi-mortarboard-fill text-emerald-600" />
                      Iniciar Matrícula Step-by-Step
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {studentTab === 'alunos' && (
        <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Alunos Ativos — Lista Geral</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-semibold text-kitanda-muted">
                  <th className="px-4 py-3">Nº Estudante</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Curso / Classe</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Aproveitamento</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-kitanda-muted">Nenhum aluno registado. Complete uma matrícula step-by-step para ver os alunos aqui.</td>
                  </tr>
                ) : (
                  data.students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-900">{s.studentNumber || s.id}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-[10px] text-kitanda-muted">{s.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 font-medium">{s.course || s.class}</td>
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{s.phone}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{s.gpa}</span>
                          <div className="h-1.5 w-12 bg-gray-100 rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(s.gpa) / 20) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
