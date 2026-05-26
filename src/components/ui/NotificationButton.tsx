interface NotificationButtonProps {
  onClick: () => void
  hasUnread: boolean
}

export default function NotificationButton({ onClick, hasUnread }: NotificationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-kitanda-muted transition-colors hover:bg-slate-100"
      title="Notificações"
      type="button"
    >
      <i className="bi bi-bell-fill text-lg" />
      {hasUnread && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-sky-600" />
      )}
      <span className="sr-only">Notificações</span>
    </button>
  )
}
