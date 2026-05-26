import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type {
  AppData,
  User,
  Student,
  Teacher,
  Task,
  Grade,
  CalendarEvent,
  Payment,
  Announcement,
  EnrollmentApplication,
  EnrollmentConfirmation,
  Course,
  Class,
  TuitionPlan,
  ApplicationStatus,
  InscriptionRequest,
} from './types'

const STORE_KEY = 'kitanda_escolar_store'
const AUTH_KEY = 'kitanda_escolar_auth'

const initialData: AppData = {
  user: {
    name: 'Diretor',
    role: 'Diretor',
    avatar: '',
    schoolName: 'Escola Kitanda',
    theme: 'light',
  },
  students: [],
  inscriptions: [],
  enrollmentApplications: [],
  enrollmentConfirmations: [],
  courses: [],
  tuitionPlans: [],
  teachers: [],
  classes: [],
  tasks: [],
  calendarEvents: [],
  grades: [],
  payments: [],
  announcements: [],
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface StoreContextValue {
  data: AppData
  loggedIn: boolean
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  addStudent: (student: Student) => void
  removeStudent: (id: string) => void
  addInscription: (inscription: Omit<InscriptionRequest, 'status'>) => void
  approveInscription: (id: string) => void
  addEnrollmentApplication: (application: EnrollmentApplication) => void
  addEnrollmentConfirmation: (confirmation: EnrollmentConfirmation) => void
  updateConfirmationStatus: (id: string, status: ApplicationStatus, rejectionReason?: string) => void
  addCourse: (course: Course) => void
  addClass: (schoolClass: Class) => void
  addTuitionPlan: (plan: TuitionPlan) => void
  addTeacher: (teacher: Teacher) => void
  removeTeacher: (id: string) => void
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  updateTaskStatus: (id: string, status: Task['status']) => void
  addGrade: (grade: Grade) => void
  addEvent: (event: CalendarEvent) => void
  removeEvent: (id: string) => void
  addPayment: (payment: Payment) => void
  confirmPayment: (id: string) => void
  addAnnouncement: (announcement: Announcement) => void
  markAnnouncementRead: (id: string) => void
  removeAnnouncement: (id: string) => void
  toggleTheme: () => void
  restoreDefaults: () => void
  toasts: Toast[]
  showToast: (message: string, type: Toast['type']) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function loadFromStorage(): AppData {
  try {
    const stored = localStorage.getItem(STORE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as AppData
      return {
        ...initialData,
        ...parsed,
        user: { ...initialData.user, ...parsed.user },
        students: parsed.students ?? [],
        inscriptions: parsed.inscriptions ?? [],
        enrollmentApplications: parsed.enrollmentApplications ?? [],
        enrollmentConfirmations: parsed.enrollmentConfirmations ?? [],
        courses: parsed.courses ?? [],
        tuitionPlans: parsed.tuitionPlans ?? [],
        teachers: parsed.teachers ?? [],
        classes: parsed.classes ?? [],
        tasks: parsed.tasks ?? [],
        calendarEvents: parsed.calendarEvents ?? [],
        grades: parsed.grades ?? [],
        payments: parsed.payments ?? [],
        announcements: parsed.announcements ?? [],
      }
    }
  } catch {
    /* ignore */
  }
  return initialData
}

function persist(data: AppData) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

function loadAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

function persistAuth(loggedIn: boolean) {
  try {
    localStorage.setItem(AUTH_KEY, loggedIn ? 'true' : 'false')
  } catch {
    /* ignore */
  }
}

function calculateGpa(studentId: string, grades: Grade[]): string {
  const studentGrades = grades.filter(g => g.studentId === studentId)
  if (studentGrades.length === 0) return '0'
  const total = studentGrades.reduce((sum, g) => sum + g.t1 + g.t2 + g.t3, 0)
  const count = studentGrades.length * 3
  return (total / count).toFixed(1)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(loadFromStorage)
  const [loggedIn, setLoggedIn] = useState(loadAuth)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    persist(data)
  }, [data])

  useEffect(() => {
    persistAuth(loggedIn)
  }, [loggedIn])

  useEffect(() => {
    if (data.user.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [data.user.theme])

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const updateUser = useCallback((partial: Partial<User>) => {
    setData(prev => ({ ...prev, user: { ...prev.user, ...partial } }))
  }, [])

  const toggleTheme = useCallback(() => {
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        theme: prev.user.theme === 'dark' ? 'light' : 'dark',
      },
    }))
  }, [])

  const logout = useCallback(() => {
    setLoggedIn(false)
    persistAuth(false)
  }, [])

  const addStudent = useCallback((student: Student) => {
    setData(prev => ({ ...prev, students: [...prev.students, student] }))
  }, [])

  const removeStudent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
      grades: prev.grades.filter(g => g.studentId !== id),
    }))
  }, [])

  const addInscription = useCallback((inscription: Omit<InscriptionRequest, 'status'>) => {
    setData(prev => ({ ...prev, inscriptions: [...prev.inscriptions, { ...inscription, status: 'PENDENTE' }] }))
  }, [])

  const approveInscription = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      inscriptions: prev.inscriptions.map(i => (i.id === id ? { ...i, status: 'APROVADA' } : i)),
    }))
  }, [])

  const addEnrollmentApplication = useCallback((application: EnrollmentApplication) => {
    setData(prev => ({ ...prev, enrollmentApplications: [...prev.enrollmentApplications, application] }))
  }, [])



  const addEnrollmentConfirmation = useCallback((confirmation: EnrollmentConfirmation) => {
    setData(prev => ({ ...prev, enrollmentConfirmations: [...prev.enrollmentConfirmations, confirmation] }))
  }, [])

  const updateConfirmationStatus = useCallback((id: string, status: ApplicationStatus, rejectionReason?: string) => {
    setData(prev => ({
      ...prev,
      enrollmentConfirmations: prev.enrollmentConfirmations.map(c =>
        c.id === id ? { ...c, status, rejectionReason } : c
      ),
    }))
  }, [])

  const addCourse = useCallback((course: Course) => {
    setData(prev => ({ ...prev, courses: [...prev.courses, course] }))
  }, [])

  const addClass = useCallback((schoolClass: Class) => {
    setData(prev => ({ ...prev, classes: [...prev.classes, schoolClass] }))
  }, [])

  const addTuitionPlan = useCallback((plan: TuitionPlan) => {
    setData(prev => ({ ...prev, tuitionPlans: [...prev.tuitionPlans, plan] }))
  }, [])

  const addTeacher = useCallback((teacher: Teacher) => {
    setData(prev => ({ ...prev, teachers: [...prev.teachers, teacher] }))
  }, [])

  const removeTeacher = useCallback((id: string) => {
    setData(prev => ({ ...prev, teachers: prev.teachers.filter(t => t.id !== id) }))
  }, [])

  const addTask = useCallback((task: Task) => {
    setData(prev => ({ ...prev, tasks: [...prev.tasks, task] }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }))
  }, [])

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, status } : t)),
    }))
  }, [])

  const addGrade = useCallback((grade: Grade) => {
    setData(prev => {
      const grades = [...prev.grades, grade]
      const students = prev.students.map(s =>
        s.id === grade.studentId
          ? { ...s, gpa: calculateGpa(s.id, grades) }
          : s
      )
      return { ...prev, grades, students }
    })
  }, [])

  const addEvent = useCallback((event: CalendarEvent) => {
    setData(prev => ({ ...prev, calendarEvents: [...prev.calendarEvents, event] }))
  }, [])

  const removeEvent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter(e => e.id !== id),
    }))
  }, [])

  const addPayment = useCallback((payment: Payment) => {
    setData(prev => ({ ...prev, payments: [...prev.payments, payment] }))
  }, [])

  const confirmPayment = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      payments: prev.payments.map(p => (p.id === id ? { ...p, status: 'pago' } : p)),
    }))
  }, [])

  const addAnnouncement = useCallback((announcement: Announcement) => {
    setData(prev => ({ ...prev, announcements: [...prev.announcements, announcement] }))
  }, [])

  const markAnnouncementRead = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(a => (a.id === id ? { ...a, read: true } : a)),
    }))
  }, [])

  const removeAnnouncement = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id),
    }))
  }, [])

  const restoreDefaults = useCallback(() => {
    document.documentElement.classList.remove('dark')
    setData(initialData)
  }, [])

  return (
    <StoreContext.Provider
      value={{
        data,
        loggedIn,
        setLoggedIn,
        logout,
        updateUser,
        toggleTheme,
        addStudent,
        removeStudent,
        addInscription,
        approveInscription,
        addEnrollmentApplication,
        addEnrollmentConfirmation,
        updateConfirmationStatus,
        addCourse,
        addClass,
        addTuitionPlan,
        addTeacher,
        removeTeacher,
        addTask,
        removeTask,
        updateTaskStatus,
        addGrade,
        addEvent,
        removeEvent,
        addPayment,
        confirmPayment,
        addAnnouncement,
        markAnnouncementRead,
        removeAnnouncement,
        restoreDefaults,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
