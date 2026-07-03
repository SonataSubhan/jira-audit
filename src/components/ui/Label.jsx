import { cn } from '@/lib/utils';

export default function Label({ children, htmlFor, className, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-xs font-mono text-white/70 uppercase tracking-wide', className)}
      {...props}
    >
      {children}
    </label>
  );
}
