import { useState, useEffect } from 'react'
import { useStore } from '../store'
import Modal, { ModalHeader } from '../components/ui/Modal'
import type { Teacher } from '../types'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const subjectColors: Record<string, string> = {
  Matemática: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Português: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Ciências: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  História: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Geografia: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Inglês: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Educação: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

function getSubjectColor(subject: string): string {
  return (
    subjectColors[subject] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  )
}

export default function ProfessoresPage({ action }: { action?: string }) {
  const { data, addTeacher, removeTeacher, showToast } = useStore()
  const { teachers } = data

  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null)
  const [showAdicionar, setShowAdicionar] = useState(false)
  const [formData, setFormData] = useState({ name: '', subject: '', phone: '', email: '', classes: '' })

  useEffect(() => {
    if (action === 'adicionar') {
      setShowAdicionar(true)
    }
  }, [action])

  function handleAdicionar(e: React.FormEvent) {
    e.preventDefault()
    const teacher: Teacher = {
      id: Date.now().toString(),
      name: formData.name,
      subject: formData.subject,
      email: formData.email,
      classes: formData.classes.split(',').map((c) => c.trim()).filter(Boolean),
      phone: formData.phone,
      avatar: '',
    }
    addTeacher(teacher)
    showToast('Professor adicionado com sucesso!', 'success')
    setShowAdicionar(false)
    setFormData({ name: '', subject: '', phone: '', email: '', classes: '' })
  }

  function handleDelete() {
    if (!deleteTarget) return
    removeTeacher(deleteTarget.id)
    showToast('Professor removido com sucesso!', 'success')
    setDeleteTarget(null)
  }

  function openAdicionar() {
    setFormData({ name: '', subject: '', phone: '', email: '', classes: '' })
    setShowAdicionar(true)
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">
            Corpo Docente
          </h1>
          <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">
            {teachers.length} professores registados
          </p>
        </div>
        <button
          onClick={openAdicionar}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-kitanda-sky text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <i className="bi bi-person-plus-fill" />
          Adicionar Novo Professor
        </button>
      </div>

      {teachers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-12 text-center glass">
          <i className="bi bi-person-badge text-4xl text-kitanda-muted dark:text-kitanda-darkTextMuted" />
          <p className="mt-3 text-kitanda-muted dark:text-kitanda-darkTextMuted">
            Nenhum professor registado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-5 glass hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-kitanda-sky/20 dark:bg-kitanda-sky/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-kitanda-sky">
                      {getInitials(t.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-kitanda-darkText truncate">
                      {t.name}
                    </h3>
                    <span
                      className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-0.5 ${getSubjectColor(t.subject)}`}
                    >
                      {t.subject}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(t)}
                  className="p-1.5 rounded-lg text-kitanda-muted dark:text-kitanda-darkTextMuted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  title="Remover"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-kitanda-muted dark:text-kitanda-darkTextMuted">
                  <i className="bi bi-telephone" />
                  <span className="text-gray-700 dark:text-kitanda-darkText">{t.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-kitanda-muted dark:text-kitanda-darkTextMuted">
                  <i className="bi bi-envelope" />
                  <span className="text-gray-700 dark:text-kitanda-darkText truncate">{t.email}</span>
                </div>
                {t.classes.length > 0 && (
                  <div className="flex items-start gap-2 text-kitanda-muted dark:text-kitanda-darkTextMuted">
                    <i className="bi bi-mortarboard mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {t.classes.map((c) => (
                        <span
                          key={c}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-kitanda-darkCard/50 text-gray-600 dark:text-kitanda-darkTextMuted"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdicionar} onClose={() => setShowAdicionar(false)}>
        <ModalHeader title="Adicionar Novo Professor" onClose={() => setShowAdicionar(false)} />
        <form onSubmit={handleAdicionar} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Nome do professor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Disciplina
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Ex: Matemática"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Telefone
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Número de telefone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="professor@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
              Turmas (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.classes}
              onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Ex: 9º Ano A, 9º Ano B"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdicionar(false)}
              className="px-5 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder text-gray-700 dark:text-kitanda-darkText text-sm font-medium hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Adicionar
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <ModalHeader title="Confirmar Eliminação" onClose={() => setDeleteTarget(null)} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 dark:text-kitanda-darkText">
            Tem certeza que deseja eliminar o professor{' '}
            <span className="font-semibold">{deleteTarget?.name}</span>?
            Esta acção não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-5 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder text-gray-700 dark:text-kitanda-darkText text-sm font-medium hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
