export interface User {
  name: string
  role: string
  avatar: string
  schoolName: string
  theme: 'light' | 'dark'
}

export interface Student {
  id: string
  studentNumber?: string
  name: string
  class: string
  email: string
  gpa: string
  status: string
  attendance: string
  parent: string
  phone: string
  bi?: string
  birthDate?: string
  course?: string
  shift?: string
}

export type InscriptionStatus = 'PENDENTE' | 'EM_ANALISE' | 'APROVADA' | 'REJEITADA'

// Campo status removido da InscriptionRequest (remanejado para a lógica interna)
export interface InscriptionRequest {
  id: string
  fullName: string
  phone: string
  email: string
  birthDate: string
  gender: string
  courseInterest: string
  academicLevel: string
  address: string
  identityDocument: string
  registrationDate: string
  status: InscriptionStatus
}

export type ApplicationStatus = 'Pendente' | 'Em Análise' | 'Aprovada' | 'Rejeitada'

export type EnrollmentStatus = 
  | 'PENDENTE' 
  | 'AGUARDANDO_PAGAMENTO' 
  | 'DOCUMENTACAO_INCOMPLETA' 
  | 'MATRICULADO' 
  | 'ATIVO' 
  | 'SUSPENSO' 
  | 'CANCELADO'

export interface DocumentSet {
  identityType: 'BI' | 'PASSAPORTE'
  identityNumber: string
  issueDate: string
  issuePlace: string
  nif?: string
  certificate: boolean
  residenceProof: boolean
  declaration: boolean
  attachments: string[]
}

export interface StudentDocumentSet {
  bi: string
  certificate: string
  residenceProof: string
  photos: string[]
}

export interface EnrollmentApplication {
  id: string
  fullName: string
  photo: string
  birthDate: string
  gender: string
  nationality: string
  maritalStatus: string
  birthPlace: string
  phone: string
  altPhone?: string
  email: string
  address: string

  documents: DocumentSet

  studentNumber?: string
  course: string
  classYear: string
  shift: string
  turma?: string
  campus: string
  academicYear: string
  status: EnrollmentStatus

  financial: {
    matriculaValue: number
    propinaValue: number
    discount: number
    paymentMethod: string
    paymentProof: string
    status: 'PENDENTE' | 'PAGO'
  }

  guardian: {
    name: string
    relation: string
    phone: string
    email: string
  }

  createdAt: string
  updatedAt: string
}

export interface EnrollmentConfirmation {
  id: string
  studentNumber: string
  status: ApplicationStatus
  submittedAt: string
  fullName: string
  bi: string
  birthDate: string
  course: string
  classYear: string
  shift: string
  phone: string
  email: string
  documents: StudentDocumentSet
  rejectionReason?: string
}

export interface Course {
  id: string
  name: string
  code: string
  duration: string
}

export interface TuitionPlan {
  id: string
  course: string
  classYear: string
  amount: string
  dueDay: string
}

export interface Teacher {
  id: string
  name: string
  subject: string
  email: string
  classes: string[]
  phone: string
  avatar: string
}

export interface Class {
  id: string
  name: string
  room: string
  teacherId: string
  studentCount: number
}

export interface Task {
  id: string
  title: string
  subject: string
  teacher: string
  date: string
  priority: 'alta' | 'media' | 'baixa'
  status: 'todo' | 'in-progress' | 'done'
  desc: string
}

export interface CalendarEvent {
  id: string
  date: string
  title: string
  type: 'evaluation' | 'meeting' | 'delivery'
  time: string
}

export interface Grade {
  studentId: string
  subject: string
  t1: number
  t2: number
  t3: number
}

export interface Payment {
  id: string
  month: string
  amount: string
  status: string
  date: string
  type: string
}

export interface Announcement {
  id: string
  title: string
  category: string
  text: string
  author: string
  date: string
  read: boolean
}

export interface AppData {
  user: User
  students: Student[]
  inscriptions: InscriptionRequest[]
  enrollmentApplications: EnrollmentApplication[]
  enrollmentConfirmations: EnrollmentConfirmation[]
  courses: Course[]
  tuitionPlans: TuitionPlan[]
  teachers: Teacher[]
  classes: Class[]
  tasks: Task[]
  calendarEvents: CalendarEvent[]
  grades: Grade[]
  payments: Payment[]
  announcements: Announcement[]
}
