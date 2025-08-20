
import { cn } from '../../../lib/utils'
import { LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>

      {/* <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} /> */}
      <LoaderCircle className={cn('animate-spin text-primary', sizeClasses[size])} />
     
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}