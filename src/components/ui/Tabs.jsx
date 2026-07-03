'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      {children}
    </RadixTabs.Root>
  );
}

export function TabsList({ children, className }) {
  return (
    <RadixTabs.List
      className={cn(
        'flex h-12 bg-black border border-white/10 p-1 rounded-sm',
        className,
      )}
    >
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({ value, children, className }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'flex-1 font-mono text-xs uppercase tracking-wide rounded-sm border border-transparent',
        'text-white/50 transition-colors',
        'data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500',
        className,
      )}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabsContent({ value, children, className }) {
  return (
    <RadixTabs.Content value={value} className={cn('focus:outline-none', className)}>
      {children}
    </RadixTabs.Content>
  );
}
