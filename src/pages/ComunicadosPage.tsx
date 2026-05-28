import { useState } from 'react'
import { useStore } from '../store'
import Modal, { ModalHeader } from '../components/ui/Modal'
import { CustomSelect } from '../components/CustomSelect'
import type { Announcement } from '../types'

const categories = ['INFO', 'URGENTE']

export default function ComunicadosPage() {
  const { data, addAnnouncement, markAnnouncementRead, removeAnnouncement, showToast } = useStore()
  const { announcements, user } = data

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', category: categories[0], text: '' })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      text: formData.text,
      author: user.name,
      date: new Date().toISOString().split('T')[0],
      read: false,
    }
    addAnnouncement(announcement)
    showToast('Comunicado lançado com sucesso!', 'success')
    setShowModal(false)
    setFormData({ title: '', category: categories[0], text: '' })
  }

  function handleRemove(id: string) {
    removeAnnouncement(id)
    showToast('Comunicado removido.', 'info')
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">Comunicados Académicos</h1>
          <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">{announcements.length} comunicados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-kitanda-sky text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <i className="bi bi-megaphone-fill" />
          Lançar Novo Comunicado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-12 text-center glass">
            <i className="bi bi-megaphone text-4xl text-kitanda-muted dark:text-kitanda-darkTextMuted" />
            <p className="mt-3 text-kitanda-muted dark:text-kitanda-darkTextMuted">Nenhum comunicado.</p>
          </div>
        ) : (
          [...announcements].reverse().map((a) => (
            <div key={a.id} className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass relative">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.category === 'URGENTE' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-kitanda-sky/20 dark:bg-kitanda-sky/10 text-kitanda-sky'}`}>
                  <i className={`bi ${a.category === 'URGENTE' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} text-lg`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${a.category === 'URGENTE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'}`}>
                      {a.category}
                    </span>
                    <span className="text-[11px] text-kitanda-muted dark:text-kitanda-darkTextMuted">
                      {new Date(a.date).toLocaleDateString('pt-PT')}
                    </span>
                    {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-kitanda-darkText">{a.title}</h3>
                  <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1.5">{a.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[11px] text-kitanda-muted dark:text-kitanda-darkTextMuted">{a.author}</p>
                    <div className="flex items-center gap-1">
                      {!a.read && (
                        <button
                          onClick={() => markAnnouncementRead(a.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg text-kitanda-sky hover:bg-kitanda-sky/10 transition-colors"
                        >
                          <i className="bi bi-check2-circle" />
                          Marcar como lido
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(a.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader title="Lançar Novo Comunicado" onClose={() => setShowModal(false)} />
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Título do comunicado"
            />
          </div>
          <CustomSelect
            label="Categoria"
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            options={categories.map((c) => ({ label: c, value: c }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Mensagem</label>
            <textarea
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow resize-none"
              placeholder="Conteúdo do comunicado"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder text-gray-700 dark:text-kitanda-darkText text-sm font-medium hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Publicar Comunicado
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
