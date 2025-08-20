


import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { type Post, postSchema } from '../../../schemas/post';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import EditPostForm from './EditPostForm';
import { toast } from 'sonner';
import LoadingSpinner from './LoadingSpinner';

const SinglePostView = () => {
  const { postId } = useParams<{ postId: string }>();
  const id = Number(postId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: post, isLoading, isError, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      // console.log('SinglePostView: Fetching post with URL:', `/posts/${id}`);
      const response = await api.get(`/posts/${id}`);
      // console.log('SinglePostView: API response data:', response.data);
      try {
        return postSchema.parse(response.data);
      } catch (parseError) {
        console.error('SinglePostView: Zod parsing error:', parseError);
        throw new Error('Failed to parse post data.');
      }
    },
    enabled: !isNaN(id),
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!post) throw new Error('Post not found');
      await api.delete(`/posts/${post.id}`);
    },
    onMutate: async () => {
      if (!post) return;
      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            page.filter((p: Post) => p.id !== post.id)
          )
        };
      });
      queryClient.removeQueries({ queryKey: ['post', post.id] });
    },
    onError: (error) => {
      toast.error('Failed to delete post', {
        description: `Error: ${error.message}. Please try again.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onSuccess: () => {
      toast.success('Post deleted successfully!', {
        description: 'The post has been removed from the feed.',
        className: 'text-green-700',
        icon: <span className="text-green-600">✔️</span>,
      });
      navigate('/');
    },
  });

  const handleDelete = () => {
    if (post) {
      deletePostMutation.mutate();
    }
  };

  if (isNaN(id)) {
    return <div className="text-center py-8">Post not found.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading post..." />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error: {error?.message}</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          ← Back to Feed
        </Button>
      </div>
      <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Post ID: {post.id}</div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 line-clamp-1">
                {post.title}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm py-1 px-2 sm:px-3 whitespace-nowrap">
              #{post.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2 mb-6 bg-blue-50 rounded-r">
            <p className="text-gray-700 text-sm sm:text-base line-clamp-6 sm:line-clamp-8">
              {post.body}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Edit Post</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <EditPostForm
                    post={post}
                    onPostEdited={() => {
                      toast.success('Post edited successfully!', {
                        description: 'Your post has been updated!',
                        className: 'text-green-700',
                        icon: <span className="text-green-600">✔️</span>,
                      });
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Post
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SinglePostView;