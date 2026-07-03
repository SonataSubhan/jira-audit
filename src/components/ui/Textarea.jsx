import { cn } from '@/lib/utils';

export default function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 rounded-sm text-sm bg-black/50 border border-white/10 text-white',
        'placeholder:text-white/20 resize-y min-h-[120px]',
        'focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500',
        className,
      )}
      {...props}
    />
  );
}
