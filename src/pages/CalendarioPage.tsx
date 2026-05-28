import { useState } from 'react'
import { useStore } from '../store'
import type { CalendarEvent } from '../types'
import Modal, { ModalHeader } from '../components/ui/Modal'
import { CustomCalendar } from '../components/CustomCalendar'
import { CustomSelect } from '../components/CustomSelect'

export default function CalendarioPage() {
  const { data, addEvent, removeEvent, showToast } = useStore()
  const { calendarEvents } = data

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [addOpen, setAddOpen] = useState(false)

  const [evTitle, setEvTitle] = useState('')
  const [evType, setEvType] = useState<CalendarEvent['type']>('evaluation')
  const [evTime, setEvTime] = useState('')

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setAddOpen(true)
    }
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate) return
    const dateStr = selectedDate.toISOString().split('T')[0]
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: dateStr,
      title: evTitle,
      type: evType,
      time: evTime,
    }
    addEvent(event)
    showToast('Evento adicionado!', 'success')
    setAddOpen(false)
  }

  const monthKey = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}` : ''
  const monthEvents = calendarEvents.filter((e) => e.date.startsWith(monthKey))

  const typeConfig: Record<string, { label: string; dot: string }> = {
    evaluation: { label: 'Avaliação', dot: 'bg-rose-500' },
    meeting: { label: 'Reunião', dot: 'bg-sky-500' },
    delivery: { label: 'Entrega', dot: 'bg-indigo-500' },
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
          <CustomCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
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
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
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
          <CustomSelect
            label="Tipo"
            value={evType}
            onChange={(val) => setEvType(val as CalendarEvent['type'])}
            options={[
              { label: 'Avaliação', value: 'evaluation' },
              { label: 'Reunião', value: 'meeting' },
              { label: 'Entrega', value: 'delivery' },
            ]}
          />
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
