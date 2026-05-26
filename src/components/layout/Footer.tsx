import { useStore } from '../../store'

export default function Footer() {
  const { data } = useStore()

  const year = new Date().getFullYear()

  return (
    <footer className="hidden border-t border-kitanda-border px-6 py-4 md:block">
      <p className="text-center text-xs text-kitanda-muted">
        &copy; {year} {data.user.schoolName}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
