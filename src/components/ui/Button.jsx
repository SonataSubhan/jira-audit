import { cn } from '@/lib/utils';

const variants = {
  default:     'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold',
  outline:     'bg-transparent border border-white/10 text-white/80 hover:bg-white/5 hover:text-white',
  ghost:       'bg-transparent text-white/40 hover:text-white hover:bg-white/5',
  destructive: 'bg-red-600 hover:bg-red-500 text-white',
  cyan:        'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400',
};

export default function Button({
  children,
  className,
  variant = 'default',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-sm text-xs font-mono uppercase tracking-wide',
        'h-9 px-4 transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500',
        variants[variant] || variants.default,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
