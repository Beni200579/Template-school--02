import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store'

interface SearchResult {
  id: string
  label: string
  subtitle: string
  type: 'Estudante' | 'Professor' | 'Tarefa'
}

interface SearchDialogProps {
  open: boolean
  onClose: () => void
  onNavigate: (module: string) => void
}

const typeConfig: Record<string, { color: string; icon: string }> = {
  Estudante: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', icon: 'bi-person-vcard' },
  Professor: { color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300', icon: 'bi-person-badge' },
  Tarefa: { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300', icon: 'bi-check2-square' },
}

export default function SearchDialog({ open, onClose, onNavigate }: SearchDialogProps) {
  const { data } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else onNavigate('search')
      }
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, onNavigate])

  if (!open) return null

  const results: SearchResult[] = query.length < 2
    ? []
    : [
        ...data.students
          .filter(
            (s) =>
              s.name.toLowerCase().includes(query.toLowerCase()) ||
              s.class.toLowerCase().includes(query.toLowerCase()),
          )
          .map((s) => ({ id: s.id, label: s.name, subtitle: s.class, type: 'Estudante' as const })),
        ...data.teachers
          .filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              t.subject.toLowerCase().includes(query.toLowerCase()),
          )
          .map((t) => ({ id: t.id, label: t.name, subtitle: t.subject, type: 'Professor' as const })),
        ...data.tasks
          .filter(
            (t) =>
              t.title.toLowerCase().includes(query.toLowerCase()) ||
              t.subject.toLowerCase().includes(query.toLowerCase()),
          )
          .map((t) => ({ id: t.id, label: t.title, subtitle: t.subject, type: 'Tarefa' as const })),
      ]

  const handleSelect = (result: SearchResult) => {
    const moduleMap: Record<string, string> = {
      Estudante: 'students',
      Professor: 'teachers',
      Tarefa: 'tasks',
    }
    const target = moduleMap[result.type] || ''
    onNavigate(target)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-[10vh] max-w-lg bg-white dark:bg-gray-900 rounded-[18px] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <i className="bi bi-search text-gray-400 text-lg" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar estudantes, professores, tarefas..."
            className="flex-1 bg-transparent px-3 py-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
              <i className="bi bi-x-lg text-sm" />
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.length < 2 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Digite pelo menos 2 caracteres para pesquisar
            </p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Nenhum resultado encontrado
            </p>
          ) : (
            results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${typeConfig[result.type].color}`}>
                  <i className={`bi ${typeConfig[result.type].icon} text-base`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {result.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${typeConfig[result.type].color}`}
                >
                  {result.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
