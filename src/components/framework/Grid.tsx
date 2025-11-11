import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Cols = 1|2|3|4|5|6|7|8|9|10|11|12;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  colsSm?: Cols;
  colsMd?: Cols;
  colsLg?: Cols;
  colsXl?: Cols;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

function colsClass(prefix: string, n?: Cols) {
  if (!n) return '';
  return `${prefix}:grid-cols-${n}`;
}

export function Grid({ cols = 1, colsSm, colsMd, colsLg, colsXl, gap = 'md', className, ...props }: GridProps) {
  const gapClass = gap === 'xs' ? 'gap-1' : gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-4' : gap === 'lg' ? 'gap-6' : 'gap-8';
  const base = `grid grid-cols-${cols}`;
  const responsive = cn(
    colsSm && colsClass('sm', colsSm),
    colsMd && colsClass('md', colsMd),
    colsLg && colsClass('lg', colsLg),
    colsXl && colsClass('xl', colsXl)
  );
  return <div className={cn(base, gapClass, responsive, className)} {...props} />;
}

export default Grid;

