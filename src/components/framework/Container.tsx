import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padded?: boolean;
}

export function Container({
  className,
  maxWidth = 'xl',
  padded = true,
  ...props
}: ContainerProps) {
  const maxW =
    maxWidth === 'sm' ? 'max-w-screen-sm' :
    maxWidth === 'md' ? 'max-w-screen-md' :
    maxWidth === 'lg' ? 'max-w-screen-lg' :
    maxWidth === 'xl' ? 'max-w-screen-xl' :
    maxWidth === '2xl' ? 'max-w-screen-2xl' :
    'max-w-full';

  return (
    <div
      className={cn('mx-auto w-full', maxW, padded && 'px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}

export default Container;

