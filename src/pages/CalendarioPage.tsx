import { useState } from 'react'
import { useStore } from '../store'
import type { CalendarEvent } from '../types'
import Modal, { ModalHeader } from '../components/ui/Modal'

const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const typeConfig: Record<string, { label: string; dot: string }> = {
  evaluation: { label: 'Avaliação', dot: 'bg-rose-500' },
  meeting: { label: 'Reunião', dot: 'bg-sky-500' },
  delivery: { label: 'Entrega', dot: 'bg-indigo-500' },
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayPad(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarioPage() {
  const { data, addEvent, removeEvent, showToast } = useStore()
  const { calendarEvents } = data

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [eventDate, setEventDate] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const [evTitle, setEvTitle] = useState('')
  const [evType, setEvType] = useState<CalendarEvent['type']>('evaluation')
  const [evTime, setEvTime] = useState('')

  const daysInMonth = getDaysInMonth(year, month)
  const pad = getFirstDayPad(year, month)
  const totalCells = Math.ceil((pad + daysInMonth) / 7) * 7

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthEvents = calendarEvents.filter((e) => e.date.startsWith(monthKey))

  function handleDayClick(day: number) {
    const dateStr = formatDate(year, month, day)
    setEventDate(dateStr)
    setEvTitle('')
    setEvType('evaluation')
    setEvTime('')
    setAddOpen(true)
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: eventDate,
      title: evTitle,
      type: evType,
      time: evTime,
    }
    addEvent(event)
    showToast('Evento adicionado!', 'success')
    setAddOpen(false)
  }

  const eventMap: Record<string, CalendarEvent[]> = {}
  monthEvents.forEach((ev) => {
    if (!eventMap[ev.date]) eventMap[ev.date] = []
    eventMap[ev.date].push(ev)
  })

  const days = []
  for (let i = 0; i < pad; i++) {
    days.push(<div key={`pad-${i}`} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(year, month, d)
    const dayEvents = eventMap[dateStr] || []
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    days.push(
      <button
        key={d}
        onClick={() => handleDayClick(d)}
        className={`relative p-2 rounded-xl text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isToday
            ? 'bg-kitanda-sky/10 text-kitanda-sky font-semibold'
            : 'text-gray-900 dark:text-kitanda-darkText'
        }`}
      >
        <span className="text-xs">{d}</span>
        {dayEvents.length > 0 && (
          <div className="flex flex-wrap gap-0.5 mt-1">
            {dayEvents.slice(0, 3).map((ev) => (
              <span
                key={ev.id}
                className={`w-1.5 h-1.5 rounded-full ${typeConfig[ev.type].dot}`}
              />
            ))}
          </div>
        )}
      </button>
    )
  }
  while (days.length < totalCells) {
    days.push(<div key={`pad-end-${days.length}`} />)
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">
          Calendário Académico
        </h1>
        <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">
          {calendarEvents.length} eventos registados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-gray-600 dark:text-kitanda-darkText hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="bi bi-chevron-left text-lg" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-gray-600 dark:text-kitanda-darkText hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="bi bi-chevron-right text-lg" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayLabels.map((dl) => (
              <div
                key={dl}
                className="text-center text-xs font-semibold text-kitanda-muted dark:text-kitanda-darkTextMuted py-2"
              >
                {dl}
              </div>
            ))}
            {days}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText">
              Eventos
            </h2>
            <i className="bi bi-calendar-event text-kitanda-muted dark:text-kitanda-darkTextMuted" />
          </div>
          {monthEvents.length === 0 ? (
            <p className="text-sm text-kitanda-muted dark:text-kitanda-darkTextMuted text-center py-8">
              Nenhum evento este mês.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {monthEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-kitanda-border dark:border-kitanda-darkBorder"
                >
                  <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${typeConfig[ev.type].dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-kitanda-darkText truncate">
                      {ev.title}
                    </p>
                    <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted mt-0.5">
                      {ev.date} {ev.time ? `· ${ev.time}` : ''}
                    </p>
                    <span className="text-[11px] font-medium text-kitanda-muted dark:text-kitanda-darkTextMuted">
                      {typeConfig[ev.type].label}
                    </span>
                  </div>
                  <button
                    onClick={() => { removeEvent(ev.id); showToast('Evento removido.', 'info') }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shrink-0"
                  >
                    <i className="bi bi-trash3 text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <ModalHeader title="Adicionar Evento" onClose={() => setAddOpen(false)} />
        <form onSubmit={handleAddEvent} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Data
            </label>
            <input
              type="date"
              required
              value={eventDate}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-kitanda-darkText text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Título
            </label>
            <input
              required
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Título do evento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Tipo
            </label>
            <select
              value={evType}
              onChange={(e) => setEvType(e.target.value as CalendarEvent['type'])}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
            >
              <option value="evaluation">Avaliação</option>
              <option value="meeting">Reunião</option>
              <option value="delivery">Entrega</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Hora
            </label>
            <input
              type="time"
              value={evTime}
              onChange={(e) => setEvTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <i className="bi bi-plus-lg" />
            Adicionar Evento
          </button>
        </form>
      </Modal>
    </div>
  )
}
