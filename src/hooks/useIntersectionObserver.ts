import { useEffect, useRef } from 'react'

interface UseIntersectionObserverProps {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
  threshold?: number
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = '100px',
  threshold = 0.1,
}: UseIntersectionObserverProps) {
  // Reference for the DOM element to observe
  const targetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target || !enabled) return

    // Create the observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // console.log("Intersection detected, loading more...")
          onIntersect()
        }
      },
      { rootMargin, threshold }
    )

    // Start observing the target
    observer.observe(target)
 return () => {
      observer.disconnect()
      // console.log("Intersection observer disconnected")
    }
  }, [onIntersect, enabled, rootMargin, threshold])

  return targetRef
}
