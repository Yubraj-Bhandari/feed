

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {  User, Calendar } from 'lucide-react'
import { useUser } from '../../../hooks/useUser'
import type { Post } from '../../../schemas/post'
import { truncateText } from '../../../lib/utils'
import { Link, } from 'react-router-dom'

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '../../../lib/api'
// import { toast } from 'sonner'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { data: user, isLoading: userLoading } = useUser(post.userId)
  // const navigate = useNavigate()
  // const queryClient = useQueryClient()


  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-200 hover:scale-[1.03] overflow-hidden bg-white border border-gray-200 rounded-xl">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          {userLoading ? (
            <Skeleton className="w-8 sm:w-10 h-8 sm:h-10 rounded-full" />
          ) : (
            <Avatar className="w-8 sm:w-10 h-8 sm:h-10">
              <AvatarFallback>
                <User className="w-3 sm:w-4 h-3 sm:h-4" />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            {userLoading ? (
              <Skeleton className="h-4 w-20 sm:w-24 mb-1" />
            ) : (
              <p className="text-xs sm:text-sm font-medium truncate">
                {user?.name || 'Unknown User'}
              </p>
            )}
            {userLoading ? (
              <Skeleton className="h-3 w-16 sm:w-20" />
            ) : (
              <p className="text-xs text-muted-foreground truncate">
                @{user?.username || 'unknown'}
              </p>
            )}
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm whitespace-nowrap">
            #{post.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-5">
        <h3 className="font-semibold text-base sm:text-lg leading-tight mb-2 sm:mb-3 capitalize line-clamp-2 sm:line-clamp-3">
          {truncateText(post.title, 60)}
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4">
          {truncateText(post.body, 150)}
        </p>
      </CardContent>
      <CardFooter className="pt-2 sm:pt-3 border-t px-3 sm:px-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
            <span>Post {post.id}</span>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Link to={`/posts/${post.id}`}>
              <Button  size="sm" className="h-8 px-3 text-xs sm:text-sm bg-black text-white font-semibold rounded hover:bg-gray-900 focus:ring-2 focus:ring-black transition-all duration-200 cursor-pointer">
                Read More
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
