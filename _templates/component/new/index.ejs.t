---
to: src/components/<%= category %>/<%= name %>.tsx
---
import React from 'react';
import { cn } from '@/lib/utils';

interface <%= name %>Props {
  className?: string;
  children?: React.ReactNode;
}

export const <%= name %>: React.FC<<%= name %>Props> = ({
  className,
  children,
}) => {
  return (
    <div className={cn('', className)}>
      {children || '<%= name %> Component'}
    </div>
  );
};
