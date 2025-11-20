import { cn } from '@/lib/utils';

interface WaveBackgroundProps {
  color?: 'primary' | 'muted';
  opacity?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

export function WaveBackground({
  color = 'primary',
  opacity = 0.1,
  position = 'bottom',
  className
}: WaveBackgroundProps) {
  const colorMap = {
    primary: 'hsl(var(--primary))',
    muted: 'hsl(var(--muted))'
  };

  return (
    <div
      className={cn(
        'absolute left-0 right-0 pointer-events-none z-0',
        position === 'bottom' ? 'bottom-0' : 'top-0',
        className
      )}
    >
      <svg
        viewBox="0 0 1440 320"
        fill="none"
        className="w-full"
        style={{ transform: position === 'top' ? 'rotate(180deg)' : 'none' }}
      >
        <path
          d="M0,160 Q360,80 720,160 T1440,160 V320 H0 Z"
          fill={colorMap[color]}
          opacity={opacity}
        />
      </svg>
    </div>
  );
}
