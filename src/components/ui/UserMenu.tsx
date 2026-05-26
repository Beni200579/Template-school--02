interface UserMenuProps {
  name: string
  role: string
  schoolName: string
  onSettings: () => void
  onLogout: () => void
}

export function UserMenu({ name, role, schoolName, onSettings, onLogout }: UserMenuProps) {
  return (
    <div className="rounded-18 border border-kitanda-border bg-white p-3 shadow-sm">
      <p className="text-sm font-semibold text-kitanda-deep">{name}</p>
      <p className="text-xs text-kitanda-muted">{role}</p>
      <p className="mt-1 text-xs text-kitanda-muted">{schoolName}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onSettings}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-kitanda-text"
          type="button"
        >
          Definições
        </button>
        <button
          onClick={onLogout}
          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600"
          type="button"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
