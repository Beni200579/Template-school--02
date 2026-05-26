const logoModules = import.meta.glob('../../Logo/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const logoSrc = Object.values(logoModules)[0]

interface AppLogoProps {
  className?: string
  markClassName?: string
  showText?: boolean
  textClassName?: string
}

export default function AppLogo({
  className = '',
  markClassName = 'w-10 h-10',
  showText = true,
  textClassName = 'text-kitanda-deep text-2xl font-bold tracking-tight',
}: AppLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt="Kitanda"
          className={`${markClassName} object-contain shrink-0`}
        />
      ) : (
        <div className={`${markClassName} rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/25 shrink-0`}>
          <span className="text-white font-bold text-sm">K</span>
        </div>
      )}
      {showText && <span className={textClassName}>Kitanda</span>}
    </div>
  )
}
