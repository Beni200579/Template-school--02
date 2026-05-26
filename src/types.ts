export interface User {
  name: string
  role: string
  avatar: string
  schoolName: string
  theme: 'light' | 'dark'
}

export interface Student {
  id: string
  name: string
  class: string
  email: string
  gpa: string
  status: string
  attendance: string
  parent: string
  phone: string
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
  teachers: Teacher[]
  classes: Class[]
  tasks: Task[]
  calendarEvents: CalendarEvent[]
  grades: Grade[]
  payments: Payment[]
  announcements: Announcement[]
}
