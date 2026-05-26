import { useStore } from '../../store'

export default function Footer() {
  const { data } = useStore()

  const year = new Date().getFullYear()

  return (
    <footer className="hidden md:block px-6 py-4 border-t border-kitanda-border dark:border-kitanda-darkBorder">
      <p className="text-center text-xs text-kitanda-muted dark:text-kitanda-darkTextMuted">
        &copy; {year} {data.user.schoolName}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
