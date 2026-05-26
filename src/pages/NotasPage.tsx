import { useState, useRef, useEffect } from 'react'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useStore } from '../store'
import type { Grade } from '../types'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const subjects = ['Matemática', 'Português', 'História', 'Ciências']
const subjectColors = ['#38BDF8', '#10B981', '#8B5CF6', '#F59E0B']

export default function NotasPage() {
  const { data, addGrade, showToast } = useStore()
  const { students, grades } = data

  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [subject, setSubject] = useState(subjects[0])
  const [t1, setT1] = useState('')
  const [t2, setT2] = useState('')
  const [t3, setT3] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const studentGrades = grades.filter((g) => g.studentId === selectedStudentId)

  const subjectsWithGrades = subjects
    .map((s) => ({
      subject: s,
      grade: studentGrades.find((g) => g.subject === s),
    }))
    .filter((sg) => sg.grade)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedStudentId) {
      showToast('Selecione um aluno.', 'error')
      return
    }
    const grade: Grade = {
      studentId: selectedStudentId,
      subject,
      t1: Number(t1),
      t2: Number(t2),
      t3: Number(t3),
    }
    addGrade(grade)
    showToast('Nota lançada com sucesso!', 'success')
    setT1('')
    setT2('')
    setT3('')
  }

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const labels = subjectsWithGrades.map((sg) => sg.subject)
    const t1Data = subjectsWithGrades.map((sg) => sg.grade!.t1)
    const t2Data = subjectsWithGrades.map((sg) => sg.grade!.t2)
    const t3Data = subjectsWithGrades.map((sg) => sg.grade!.t3)

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: '1º Trim', data: t1Data, backgroundColor: subjectColors[0], borderRadius: 6 },
          { label: '2º Trim', data: t2Data, backgroundColor: subjectColors[1], borderRadius: 6 },
          { label: '3º Trim', data: t3Data, backgroundColor: subjectColors[2], borderRadius: 6 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94A3B8' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#94A3B8' },
            grid: { color: '#1E293B' },
          },
          y: {
            beginAtZero: true,
            max: 20,
            ticks: { color: '#94A3B8' },
            grid: { color: '#1E293B' },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [selectedStudentId, grades])

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-kitanda-darkText">
          Pauta & Lançamentos
        </h1>
        <p className="text-kitanda-muted dark:text-kitanda-darkTextMuted mt-1">
          Gerir notas e boletim escolar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass h-fit">
          <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText mb-4">
            Lançar Nota
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
                Aluno
              </label>
              <select
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              >
                <option value="">Selecionar aluno</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.class}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
                Disciplina
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
                  1º Trim
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={20}
                  step={0.1}
                  value={t1}
                  onChange={(e) => setT1(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
                  placeholder="0-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
                  2º Trim
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={20}
                  step={0.1}
                  value={t2}
                  onChange={(e) => setT2(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
                  placeholder="0-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-kitanda-darkText mb-1.5">
                  3º Trim
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={20}
                  step={0.1}
                  value={t3}
                  onChange={(e) => setT3(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-kitanda-border dark:border-kitanda-darkBorder bg-white dark:bg-slate-900 text-gray-900 dark:text-kitanda-darkText text-sm focus:outline-none focus:ring-2 focus:ring-kitanda-sky/40 transition-shadow"
                  placeholder="0-20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-2.5 rounded-xl bg-kitanda-sky text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <i className="bi bi-save-fill" />
              Salvar Nota
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <>
              <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText">
                    Boletim Escolar — {selectedStudent.name}
                  </h2>
                  <i className="bi bi-file-text-fill text-kitanda-muted dark:text-kitanda-darkTextMuted" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-kitanda-border dark:border-kitanda-darkBorder">
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText">Disciplina</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText">1º Trim</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText">2º Trim</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText">3º Trim</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-kitanda-darkText">Média</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectsWithGrades.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-kitanda-muted dark:text-kitanda-darkTextMuted">
                            Nenhuma nota registada para este aluno.
                          </td>
                        </tr>
                      ) : (
                        subjectsWithGrades.map((sg) => {
                          const avg = ((sg.grade!.t1 + sg.grade!.t2 + sg.grade!.t3) / 3).toFixed(1)
                          return (
                            <tr
                              key={sg.subject}
                              className="border-b border-kitanda-border dark:border-kitanda-darkBorder last:border-0"
                            >
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-kitanda-darkText">
                                {sg.subject}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-kitanda-darkText">{sg.grade!.t1}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-kitanda-darkText">{sg.grade!.t2}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-kitanda-darkText">{sg.grade!.t3}</td>
                              <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-kitanda-darkText">
                                {avg}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {subjectsWithGrades.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-6 glass">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-kitanda-darkText">
                      Comparativo por Trimestre
                    </h2>
                    <i className="bi bi-bar-chart-fill text-kitanda-muted dark:text-kitanda-darkTextMuted" />
                  </div>
                  <div className="h-72">
                    <canvas ref={canvasRef} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-kitanda-border dark:border-kitanda-darkBorder rounded-18 p-12 text-center glass">
              <i className="bi bi-person-vcard text-4xl text-kitanda-muted dark:text-kitanda-darkTextMuted" />
              <p className="mt-3 text-kitanda-muted dark:text-kitanda-darkTextMuted">
                Selecione um aluno para ver o boletim.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
