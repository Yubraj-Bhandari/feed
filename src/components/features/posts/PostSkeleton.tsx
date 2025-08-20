import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PostSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </CardHeader>

      <CardContent>
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardFooter>
    </Card>
  )
}