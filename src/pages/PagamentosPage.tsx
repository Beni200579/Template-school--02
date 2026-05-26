import { useState } from 'react'
import { useStore } from '../store'
import Modal, { ModalHeader } from '../components/ui/Modal'
import type { Payment } from '../types'

const paymentTypes = ['Mensalidade', 'Propina', 'Material', 'Inscrição']

const statusStyles: Record<string, string> = {
  pago: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  pendente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  atrasado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function PagamentosPage() {
  const { data, addPayment, confirmPayment, showToast } = useStore()
  const { payments, user } = data

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ type: paymentTypes[0], month: '', amount: '25.000 Kz' })

  function handleAddPayment(e: React.FormEvent) {
    e.preventDefault()
    const payment: Payment = {
      id: Date.now().toString(),
      type: formData.type,
      month: formData.month,
      amount: formData.amount,
      status: 'pendente',
      date: new Date().toLocaleDateString('pt-PT'),
    }
    addPayment(payment)
    showToast('Pagamento registado com sucesso!', 'success')
    setShowModal(false)
    setFormData({ type: paymentTypes[0], month: '', amount: '25.000 Kz' })
  }

  function handlePayNow(id: string) {
    confirmPayment(id)
    showToast('Pagamento confirmado com sucesso!', 'success')
  }

  function openInvoice(p: Payment) {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html>
        <head>
          <title>Fatura / Recibo</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 40px; color: #1f2937; }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { color: #6b7280; margin: 4px 0; }
            .details { margin-bottom: 30px; }
            .details p { margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${user.schoolName}</h1>
            <p>Fatura / Recibo de Pagamento</p>
          </div>
          <div class="details">
            <p><strong>Emitido para:</strong> ${user.name}</p>
            <p><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
          </div>
          <table>
            <thead>
              <tr><th>Finalidade</th><th>Período</th><th>Valor</th></tr>
            </thead>
            <tbody>
              <tr><td>${p.type}</td><td>${p.month}</td><td>${p.amount}</td></tr>
            </tbody>
          </table>
          <div class="total">Total: ${p.amount}</div>
          <div class="footer">Documento gerado pelo Sistema Kitanda Escolar v2.1.0</div>
        </body>
      </html>
    `)
    w.document.close()
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">Mensalidades & Propina</h1>
          <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">Gerir pagamentos escolares</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-kitanda-sky text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <i className="bi bi-cash-coin" />
          Efetuar Pagamento Rápido
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 overflow-hidden glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-kitanda-border dark:border-kitanda-darkBorder bg-gray-50 dark:bg-kitanda-darkCard/30">
                <th className="text-left px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Finalidade</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Período</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Valor</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Estado</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Data</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-700 dark:text-kitanda-darkText">Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-kitanda-muted dark:text-kitanda-darkTextMuted">
                    Nenhum pagamento encontrado.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-kitanda-border dark:border-kitanda-darkBorder last:border-0 hover:bg-gray-50 dark:hover:bg-kitanda-darkCard/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-kitanda-darkText">{p.type}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-kitanda-darkText">{p.month}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-kitanda-darkText">{p.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyles[p.status] || statusStyles.pendente}`}>
                        {p.status === 'pago' ? 'Pago' : p.status === 'pendente' ? 'Pendente' : 'Atrasado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-kitanda-darkText">{p.date}</td>
                    <td className="px-4 py-3 text-right">
                      {p.status === 'pago' ? (
                        <button
                          onClick={() => openInvoice(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-xs font-medium"
                          title="Ver Fatura/Recibo"
                        >
                          <i className="bi bi-file-pdf-fill text-base" />
                          Fatura
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayNow(p.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-xs font-medium"
                        >
                          <i className="bi bi-credit-card-2-back-fill" />
                          Pagar Agora
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader title="Efetuar Pagamento Rápido" onClose={() => setShowModal(false)} />
        <form onSubmit={handleAddPayment} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Finalidade</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
            >
              {paymentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Mês / Período</label>
            <input
              type="text"
              required
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Ex: Maio 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">Valor</label>
            <input
              type="text"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              placeholder="Valor"
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
              Registrar Pagamento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
