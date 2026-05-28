import { useState } from 'react'
import { useStore } from '../store'
import AppLogo from '../components/ui/AppLogo'
import loginBg from '../lg/Gemini_Generated_Image_m0uzdvm0uzdvm0uz.png'

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
    <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side: Image + Branding */}
        <div className="hidden lg:flex w-1/2 relative bg-gray-900">
          <img
            src={loginBg}
            alt="Sala de aula"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AppLogo textClassName="text-white text-2xl font-bold tracking-tight" markClassName="h-9 w-9 bg-transparent" />
            </h2>
            
            <div className="space-y-4">
              <div className="px-3 py-1 bg-emerald-600 rounded-lg text-xs font-bold uppercase inline-block">Plataforma Colaborativa</div>
              <h1 className="text-4xl font-bold leading-tight text-white">Kitanda <span className="text-white">Gestão Escolar</span></h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                Liderança e eficácia administrativa na vanguarda da educação técnica nacional.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col justify-center p-12 lg:p-20">
          <div className="mb-10">
            <AppLogo className="mb-4" />
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Gestão Escolar</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-500 text-sm">Entre para aceder ao sistema de gestão corporativa escolar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">E-MAIL DO ADMINISTRADOR</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <i className="bi bi-envelope" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm"
                  placeholder="felisminoebenezer@gmail.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">SENHA DE ACESSO</label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <i className="bi bi-lock" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                  <i className="bi bi-eye" />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="text-sm text-gray-600">Lembrar-me neste dispositivo</span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-sm"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © Kitanda Gestão Escolar 2026. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
