import { cn } from '@/lib/utils';

export default function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full h-12 px-3 rounded-sm text-sm bg-black/50 border border-white/10 text-white',
        'placeholder:text-white/20',
        'focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        '[color-scheme:dark]',
        className,
      )}
      {...props}
    />
  );
}
