import { useStore } from '../store'

const schedule = [
  { time: '08:00 - 09:30', subject: 'Matemática', teacher: 'Carlos Mendes', room: 'Sala 101' },
  { time: '09:45 - 11:15', subject: 'Português', teacher: 'Maria Silva', room: 'Sala 102' },
  { time: '11:30 - 13:00', subject: 'Ciências', teacher: 'Ricardo Santos', room: 'Sala 103' },
  { time: '14:00 - 15:30', subject: 'História', teacher: 'Márcia Costa', room: 'Sala 104' },
]

function KpiCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} shadow-sm`}>
          <i className={`bi ${icon} text-xl text-white`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-kitanda-muted">{label}</p>
    </div>
  )
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" className="progress-ring">
        <defs>
          <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#gpaGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
        />
      </svg>
      <span className="text-2xl font-bold text-gray-900">{value.toFixed(1)}%</span>
      <span className="text-xs text-kitanda-muted">{label}</span>
    </div>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 200
  const height = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`).join(' ')

  return (
    <svg width={width} height={height} className="w-full overflow-visible">
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon fill="url(#sparkGradient)" points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  )
}

export default function DashboardPage() {
  const { data } = useStore()
  const { students, teachers, tasks } = data

  const pendingTasks = tasks.filter((t) => t.status !== 'done')
  const avgGpa =
    students.length > 0
      ? students.reduce((sum, s) => sum + Number(s.gpa), 0) / students.length
      : 0
  const announcements = data.announcements.slice(-2)

  return (
    <div className="space-y-6 fade-in-up">
      <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase text-emerald-600">Visão geral</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Painel Principal</h1>
        <p className="mt-1 text-kitanda-muted">
          Bem-vindo(a), {data.user.name}! Aqui está o resumo da sua escola.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon="bi-people-fill" label="Total de Alunos" value={students.length.toString()} color="bg-emerald-500" />
        <KpiCard icon="bi-person-badge-fill" label="Professores" value={teachers.length.toString()} color="bg-kitanda-sky" />
        <KpiCard icon="bi-list-task" label="Tarefas Pendentes" value={pendingTasks.length.toString()} color="bg-amber-500" />
        <KpiCard icon="bi-trophy-fill" label="Média Geral GPA" value={avgGpa.toFixed(1)} color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Horário de Aulas</h2>
              <i className="bi bi-calendar-week text-kitanda-muted" />
            </div>
            <div className="space-y-3">
              {schedule.map((slot) => (
                <div
                  key={`${slot.time}-${slot.subject}`}
                  className="flex items-center gap-4 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <div className="w-20 shrink-0 text-xs font-medium text-kitanda-muted">{slot.time}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{slot.subject}</p>
                    <p className="text-xs text-kitanda-muted">
                      {slot.teacher} • {slot.room}
                    </p>
                  </div>
                  <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Metas do Semestre</h2>
              <i className="bi bi-graph-up-arrow text-kitanda-muted" />
            </div>
            <div className="space-y-5">
              {[
                ['Aproveitamento', '78%', 'from-emerald-400 to-emerald-600'],
                ['Frequência', '92%', 'from-kitanda-sky to-blue-500'],
                ['Extracurricular', '45%', 'from-amber-400 to-amber-500'],
              ].map(([label, value, gradient]) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-semibold text-emerald-600">{value}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100">
                    <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60 md:p-6">
            <ProgressRing value={Number(((avgGpa / 20) * 100).toFixed(1))} label="Média Geral" />
            <p className="mt-1 text-center text-xs text-kitanda-muted">Baseado em {students.length} alunos</p>
          </div>

          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Progresso Semestral</h2>
              <i className="bi bi-bar-chart-fill text-kitanda-muted" />
            </div>
            <Sparkline data={[45, 52, 48, 58, 62, 55, 68, 72, 78, 82, 79, 85]} color="#10B981" />
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-kitanda-muted">
                <span>Início do Semestre</span>
                <span>Atual</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <div className="rounded-18 border border-kitanda-border bg-white p-5 shadow-sm shadow-slate-200/60 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Últimos Comunicados</h2>
              <i className="bi bi-megaphone-fill text-kitanda-muted" />
            </div>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm text-kitanda-muted">Nenhum comunicado recente.</p>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {a.category}
                      </span>
                      {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-kitanda-muted">{a.text}</p>
                    <p className="mt-1.5 text-xs text-kitanda-muted">
                      {a.author} • {new Date(a.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
