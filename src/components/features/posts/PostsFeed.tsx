
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { type Post, postsArraySchmea } from '../../../schemas/post';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import AddPostForm from './AddPostForm';

const PostsFeed = () => {
  const { data: posts, isLoading, isError, error } = useQuery<Post[]>({ 
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/posts');
      return postsArraySchmea.parse(response.data);
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error: {error?.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">All Posts</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add New Post</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Post</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <AddPostForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {posts?.map((post) => (
          <Card key={post.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] min-w-[250px] max-w-[400px]">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{post.body.substring(0, 100)}...</p>
              <Link to={`/posts/${post.id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;

