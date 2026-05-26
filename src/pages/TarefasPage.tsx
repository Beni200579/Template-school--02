import { useState, useEffect } from 'react'
import { useStore } from '../store'
import type { Task } from '../types'
import Modal, { ModalHeader } from '../components/ui/Modal'

const priorityConfig: Record<string, { label: string; class: string }> = {
  alta: { label: 'Alta', class: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
  media: { label: 'Média', class: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  baixa: { label: 'Baixa', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
}

const statusColumns: { key: Task['status']; label: string }[] = [
  { key: 'todo', label: 'Pendentes' },
  { key: 'in-progress', label: 'Em Curso' },
  { key: 'done', label: 'Concluído' },
]

export default function TarefasPage({ action }: { action?: string }) {
  const { data, addTask, removeTask, updateTaskStatus, showToast } = useStore()
  const { tasks } = data

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('media')
  const [teacher, setTeacher] = useState('')
  const [deadline, setDeadline] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    if (action === 'nova') setCreateOpen(true)
  }, [action])

  function resetForm() {
    setTitle('')
    setSubject('')
    setPriority('media')
    setTeacher('')
    setDeadline('')
    setDesc('')
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const task: Task = {
      id: Date.now().toString(),
      title,
      subject,
      priority,
      teacher,
      date: deadline,
      status: 'todo',
      desc,
    }
    addTask(task)
    showToast('Tarefa criada com sucesso!', 'success')
    setCreateOpen(false)
    resetForm()
  }

  function handleDelete() {
    if (!deleteId) return
    removeTask(deleteId)
    showToast('Tarefa removida.', 'info')
    setDeleteOpen(false)
    setDeleteId(null)
  }

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData('text/plain', taskId)
    e.currentTarget.classList.add('dragging')
  }

  function handleDragEnd(e: React.DragEvent) {
    e.currentTarget.classList.remove('dragging')
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent, status: Task['status']) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) updateTaskStatus(taskId, status)
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">
            Gestão de Tarefas
          </h1>
          <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">
            {tasks.length} tarefas registadas
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <i className="bi bi-plus-lg" />
          Criar Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map(({ key, label }) => {
          const columnTasks = tasks.filter((t) => t.status === key)
          return (
            <div
              key={key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, key)}
              className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-4 glass min-h-[300px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-kitanda-darkText">
                  {label}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-kitanda-sky/10 text-kitanda-sky">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-gray-50 dark:bg-gray-800/50 border border-kitanda-border dark:border-kitanda-darkBorder rounded-xl p-4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityConfig[task.priority].class}`}
                      >
                        {priorityConfig[task.priority].label}
                      </span>
                      <span className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">
                        {task.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-kitanda-darkText mb-1">
                      {task.title}
                    </h3>
                    {task.desc && (
                      <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted mb-2 line-clamp-2">
                        {task.desc}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted mb-3">
                      <span className="inline-flex items-center gap-1">
                        <i className="bi bi-book" />
                        {task.subject}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <i className="bi bi-person" />
                        {task.teacher}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'done' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'done')}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors inline-flex items-center justify-center gap-1"
                        >
                          <i className="bi bi-check-lg" />
                          Marcar como concluída
                        </button>
                      )}
                      <button
                        onClick={() => { setDeleteId(task.id); setDeleteOpen(true) }}
                        className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs font-medium hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <p className="text-center text-sm text-kitanda-muted dark:text-kitanda-darkTextMuted py-8">
                    Nenhuma tarefa
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); resetForm() }}>
        <ModalHeader title="Nova Tarefa" onClose={() => { setCreateOpen(false); resetForm() }} />
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Título
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Título da tarefa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Disciplina
            </label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Ex: Matemática"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Professor
            </label>
            <input
              required
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Nome do professor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Data Limite
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Descrição
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow resize-none"
              placeholder="Descrição opcional"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <i className="bi bi-plus-lg" />
            Criar Tarefa
          </button>
        </form>
      </Modal>

      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeleteId(null) }}>
        <ModalHeader title="Confirmar Remoção" onClose={() => { setDeleteOpen(false); setDeleteId(null) }} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 dark:text-kitanda-darkText">
            Tem a certeza que deseja remover esta tarefa?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => { setDeleteOpen(false); setDeleteId(null) }}
              className="px-4 py-2 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder text-sm font-medium text-gray-700 dark:text-kitanda-darkText hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="bi bi-trash3" />
              Remover
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
