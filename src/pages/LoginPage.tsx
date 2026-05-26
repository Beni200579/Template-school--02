import { useState } from 'react'
import { useStore } from '../store'
import AppLogo from '../components/ui/AppLogo'

export default function LoginPage() {
  const { setLoggedIn, showToast, data } = useStore()
  const [email, setEmail] = useState('ana.silva@kitanda.com')
  const [password, setPassword] = useState('password123')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoggedIn(true)
    showToast(`Bem-vindo(a) de volta, ${data.user.name}!`, 'success')
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f6f8fb]">
      <div className="hidden lg:flex relative w-[58%] min-h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 login-visual">
          <img
            src="/sala_de_aula.png"
            alt="Sala de aula"
            className="w-full h-full object-cover object-[35%_center]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/74 to-white/18" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-50/95 via-white/45 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <AppLogo />

          <div className="max-w-md">
            <h1 className="text-kitanda-deep text-5xl font-bold leading-tight mb-4">
              Gestão Escolar<br />Simplificada
            </h1>
            <p className="text-kitanda-muted text-lg leading-relaxed">
              A plataforma completa para gerenciar sua instituição de ensino com
              eficiência e praticidade.
            </p>
          </div>

          <div className="flex items-center gap-4 text-kitanda-muted/80 text-xs">
            <span>© 2026 Kitanda Escolar</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Termos de Uso</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Privacidade</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#eef7f2_100%)]">
        <div className="absolute inset-0 lg:hidden">
          <img
            src="/sala_de_aula.png"
            alt="Sala de aula"
            className="w-full h-full object-cover object-[35%_center]"
          />
          <div className="absolute inset-0 bg-white/88" />
        </div>

        <div className="relative z-10 w-full max-w-md fade-in-up">
          <AppLogo className="lg:hidden justify-center mb-8" />

          <div className="rounded-18 bg-white border border-slate-200 p-7 md:p-9 shadow-xl shadow-slate-200/70">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Acessar Plataforma
              </h2>
              <p className="text-kitanda-muted mt-2">
                Faça login para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-kitanda-muted">
                    <i className="bi bi-envelope-fill" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-kitanda-border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-kitanda-muted">
                    <i className="bi bi-lock-fill" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-kitanda-border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
                    placeholder="Sua senha"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span className="text-kitanda-muted">
                    Lembrar-me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Entrar na Plataforma
                <i className="bi bi-arrow-right text-lg" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-kitanda-border text-center">
              <p className="text-xs text-kitanda-muted">
                Ambiente seguro • Dados criptografados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
