import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function Stack({ gap = 'md', align = 'stretch', className, ...props }: StackProps) {
  const gapClass = gap === 'xs' ? 'gap-1' : gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-4' : gap === 'lg' ? 'gap-6' : 'gap-8';
  const alignClass =
    align === 'start' ? 'items-start' : align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : 'items-stretch';
  return <div className={cn('flex flex-col', gapClass, alignClass, className)} {...props} />;
}

export default Stack;

