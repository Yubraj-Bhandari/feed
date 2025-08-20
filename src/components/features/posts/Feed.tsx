


import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { AlertCircle, RefreshCw, Rss } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
// import { toast } from 'sonner';
import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import LoadingSpinner from './LoadingSpinner'
import { useInfinitePosts } from '../../../hooks/useInfinitePosts'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import { LogOut } from 'lucide-react'

export default function Feed() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  
  // State for logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(true) // Show confirmation dialog instead of logging out immediately
  }

  const confirmLogout = () => {
    logout()
    navigate("/login")
    setShowLogoutConfirm(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto ">
        {/* Top Bar */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/posts')} className="h-9 px-4">
            Read Posts
          </Button>
        </div>
        <div className="text-center mb-6 sm:mb-8">
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
          <Button onClick={() => refetch()} disabled={isRefetching} className="h-10 px-6">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto ">
        {/* Top Bar - Compact layout with proper button sizing */}
        <div className="flex justify-between items-center">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {user?.email || 'No email'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="h-9 px-4 bg-black text-white hover:bg-gray-900 focus:ring-2 focus:ring-black font-medium"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              {/* <Link to="/posts/new">
                <Button 
                  size="sm" 
                  className="h-9 px-4 bg-black text-white hover:bg-gray-900 focus:ring-2 focus:ring-black font-medium"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Post
                </Button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Header - Reduced top margin */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-900 drop-shadow-2xl underline underline-offset-8 decoration-8 tracking-tight">
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
                 <p>You've reached the end of the feed!</p>             
                </div>
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

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-dialog-overlay">
          <div className="logout-dialog-content">
            <h2 className="logout-dialog-title">Logout</h2>
            <p className="logout-dialog-description">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>
            <div className="logout-dialog-actions">
              <button 
                className="logout-dialog-cancel"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button 
                className="logout-dialog-confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}