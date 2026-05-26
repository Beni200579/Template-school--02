import { useState } from 'react'
import { useStore } from '../store'

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

const timeSlots = [
  { label: '08:00 - 09:30', key: 'slot1' },
  { label: '10:00 - 11:30', key: 'slot2' },
  { label: '11:45 - 13:15', key: 'slot3' },
]

const weeklyData: Record<string, Record<string, string>> = {
  slot1: { Seg: 'Matemática', Ter: 'Português', Qua: 'Ciências', Qui: 'História', Sex: 'Matemática' },
  slot2: { Seg: 'Português', Ter: 'Matemática', Qua: 'História', Qui: 'Ciências', Sex: 'Português' },
  slot3: { Seg: 'Ciências', Ter: 'História', Qua: 'Matemática', Qui: 'Português', Sex: 'Educação Física' },
}

const subjectBadge: Record<string, string> = {
  Matemática: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Português: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Ciências: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  História: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Educação Física': 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
}

function KpiCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 fade-in-up glass">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <i className={`bi ${icon} text-white text-xl`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-kitanda-darkText">{value}</p>
      <p className="text-sm text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">{label}</p>
    </div>
  )
}

export default function TurmasPage() {
  const { data } = useStore()
  const { classes, teachers } = data

  const [activeClassId, setActiveClassId] = useState(classes[0]?.id ?? '')

  const activeClass = classes.find((c) => c.id === activeClassId)
  const directorTeacher = activeClass
    ? teachers.find((t) => t.id === activeClass.teacherId)
    : null

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">
          Turmas & Horários
        </h1>
        <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">
          {classes.length} turmas registadas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon="bi-mortarboard-fill" label="Total de Turmas" value={classes.length.toString()} color="bg-kitanda-sky" />
        <KpiCard
          icon="bi-person-badge-fill"
          label="Diretor de Turma"
          value={directorTeacher?.name ?? '—'}
          color="bg-emerald-500"
        />
        <KpiCard
          icon="bi-geo-alt-fill"
          label="Sala Atribuída"
          value={activeClass?.room ?? '—'}
          color="bg-violet-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {classes.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveClassId(c.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeClassId === c.id
                ? 'bg-kitanda-sky text-white shadow-lg shadow-kitanda-sky/30'
                : 'bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder text-gray-700 dark:text-kitanda-darkText hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/50'
            }`}
          >
            <i className="bi bi-people-fill mr-2" />
            {c.name}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText">
            Horário Semanal — {activeClass?.name ?? '—'}
          </h2>
          <i className="bi bi-calendar-week text-kitanda-muted dark:text-kitanda-darkTextMuted" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-kitanda-border dark:border-kitanda-darkBorder">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText w-36">
                  Horário
                </th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr
                  key={slot.key}
                  className="border-b border-kitanda-border dark:border-kitanda-darkBorder last:border-0"
                >
                  <td className="px-4 py-3 text-kitanda-muted dark:text-kitanda-darkTextMuted font-medium whitespace-nowrap">
                    {slot.label}
                  </td>
                  {daysOfWeek.map((day) => {
                    const subject = weeklyData[slot.key]?.[day] ?? ''
                    const badgeClass = subjectBadge[subject] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    return (
                      <td key={day} className="px-4 py-3 text-center">
                        {subject ? (
                          <span
                            className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${badgeClass}`}
                          >
                            {subject}
                          </span>
                        ) : (
                          <span className="text-kitanda-muted dark:text-kitanda-darkTextMuted">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
