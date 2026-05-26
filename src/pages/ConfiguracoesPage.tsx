import { useState } from 'react'
import { useStore } from '../store'
import Modal, { ModalHeader } from '../components/ui/Modal'

export default function ConfiguracoesPage() {
  const { data, updateUser, restoreDefaults, showToast } = useStore()
  const { user } = data

  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: user.name, role: user.role, schoolName: user.schoolName })

  function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    updateUser(form)
    showToast('Perfil atualizado com sucesso!', 'success')
  }

  function handleRestore() {
    restoreDefaults()
    document.documentElement.classList.remove('dark')
    setShowConfirm(false)
    showToast('Configurações restauradas para valores de fábrica.', 'success')
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">Definições do Sistema</h1>
        <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">Personalize a sua experiência</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass h-fit">
          <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText mb-4">Perfil de Utilizador</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Nome</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Cargo</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Nome da Escola</label>
              <input
                type="text"
                required
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <i className="bi bi-check2-circle" />
              Atualizar Perfil
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
            <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText mb-4">Definições Estéticas & Interface</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-kitanda-darkCard/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <i className="bi bi-sun-fill text-amber-600 dark:text-amber-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-kitanda-darkText">Tema claro</p>
                    <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">
                      A interface usa uma base clara para melhor leitura.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Ativo
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-kitanda-darkCard/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <i className="bi bi-arrow-counterclockwise text-rose-600 dark:text-rose-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-kitanda-darkText">Restaurar Fábrica</p>
                    <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">Repor todas as definições e dados</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-kitanda-darkText">Kitanda Escolar</p>
                <p className="text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">Sistema de Gestão Escolar</p>
              </div>
              <span className="text-xs font-mono text-kitanda-muted dark:text-kitanda-darkTextMuted px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-kitanda-darkCard/50">
                v2.1.0-release
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <ModalHeader title="Confirmar Restauro" onClose={() => setShowConfirm(false)} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 dark:text-kitanda-darkText">
            Tem certeza que deseja restaurar as definições de fábrica? Esta ação irá apagar todos os dados inseridos e não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-5 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder text-gray-700 dark:text-kitanda-darkText text-sm font-medium hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleRestore}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Restaurar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
