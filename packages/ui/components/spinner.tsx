import { cn } from '@/lib/utils';
import { Loader2Icon, type SVGAttributes } from 'lucide-react';

function Spinner({ className, ...props }: SVGAttributes) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
