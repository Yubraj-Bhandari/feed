

import { useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { AlertCircle, RefreshCw, Rss, PlusCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner';

import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import LoadingSpinner from './LoadingSpinner'
import { useInfinitePosts } from '../../../hooks/useInfinitePosts'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import { LogOut } from 'lucide-react'; // Import LogOut icon

export default function Feed() {
  const [selectedPostId,setSelectedPostId] = useState<number | null>(null)

  const { logout, user } = useAuth() // Destructure user from useAuth
  const navigate = useNavigate()

  const handleLogout = () => {
     logout()
     navigate("/login")
   }
  
  // Mock functions for CRUD operations 
  const handleAddPost = async (newPost: any) => {
    //Simulate adding a post
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('Post added successfully!')
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useInfinitePosts()

  // Memoize the onIntersect callback to prevent unnecessary re-renders
  //function calls are stored (cached) to avoid redundant calculations when the same inputs occur again
  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle infinite scroll 
  const intersectionRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: '200px'
  })

  // Get all posts from all pages
  const allPosts = data?.pages.flat() || []
  const totalPosts = allPosts.length

  // Handle view comments
  const handleViewComments = useCallback((postId: number) => {
    setSelectedPostId(postId)
    // console.log(`📝 Viewing comments for post ${postId}`)
    //  navigation
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-2 -mt-2 relative z-10">
        {/* Top Bar */}
        <div className="flex justify-end mb-4 gap-2 relative z-50 pr-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/posts')}>
            Read Posts
          </Button>
        </div>
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rss className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Social Feed</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading your personalized feed...</p>
        </div>
  
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex-1 min-w-[280px] max-w-[350px]">
              <PostSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <strong>Error loading posts:</strong> {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 -mt-2 relative z-10">
    {/* Top Bar - Email and Buttons aligned */}
<div className="flex justify-end items-end mt-0 mb-2 pt-2">
  <div className="flex flex-col items-end gap-2">
    <span className="text-sm sm:text-base font-medium text-gray-700 select-all">
      {user?.email || 'No email'}
    </span>
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        className="bg-black text-white hover:bg-gray-900 focus:ring-2 focus:ring-black px-4 py-2 rounded-md font-semibold shadow transition-all duration-200 cursor-pointer"
        onClick={handleLogout}
      >
        Logout <LogOut className="w-4 h-4 ml-1" />
      </Button>
      <Link to="/posts/new">
        <Button size="sm" className="bg-black text-white hover:bg-gray-900 focus:ring-2 focus:ring-black px-4 py-2 rounded-md font-semibold shadow transition-all duration-200 cursor-pointer">
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Post
        </Button>
      </Link>
    </div>
  </div>
</div>
      {/* Header */}
      <div className="text-center mt-0 mb-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-2xl underline underline-offset-8 decoration-8 decoration-pink-400 tracking-tight pb-2">
          Feed
        </h1>
      </div>
      {/* Posts Flexbox Layout */}
      {totalPosts > 0 ? (
        <>
          <div className="flex flex-wrap gap-6 justify-center">
            {allPosts.map((post, index) => (
              <div key={`${post.id}-${index}`} className="flex-1 min-w-[280px] max-w-[350px]">
                <PostCard 
                  post={post} 
                  onViewComments={handleViewComments}
                />
              </div>
            ))}
          </div>

          {/* Intersection Observer Target */}
          <div ref={intersectionRef} className="h-4" />

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <LoadingSpinner 
              text="Loading more posts..." 
              className="py-8"
            />
          )}

          {/* End of Feed Message */}
          {!hasNextPage && (
            <div className="text-center py-12 border-t">
              <div className="max-w-md mx-auto">
               <p>You've reached the end of the feed!</p>             </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Rss className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground">
            There are no posts to display right now.
          </p>
        </div>
      )}
    </div>
  )
}