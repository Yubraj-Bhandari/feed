

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { type Post, postSchema } from '../../../schemas/post';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { toast } from 'sonner';

const addPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

type AddPostFormData = z.infer<typeof addPostSchema>;

const AddPostForm = ({ onPostAdded }: { onPostAdded?: () => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<AddPostFormData>({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const handleBack = () => {
    navigate('/'); // Navigate back to feed home page
  };

  const addPostMutation = useMutation({
    mutationFn: async (newPost: Omit<Post, 'id'>) => {
      const response = await api.post('/posts', newPost);
      return postSchema.parse(response.data);
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        // If paginated (infinite scroll)
        if (oldData.pages) {
          return {
            ...oldData,
            pages: [
              [{ ...newPost, id: Date.now(), userId: 1 }, ...oldData.pages[0]],
              ...oldData.pages.slice(1)
            ]
          };
        }
        // If flat array
        if (Array.isArray(oldData)) {
          return [{ ...newPost, id: Date.now(), userId: 1 }, ...oldData];
        }
        return oldData;
      });
      return { previousPosts };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error('Failed to add post', {
        description: `Error: ${error.message}. Please try again.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onSuccess: () => {
      toast.success('Post added successfully!', {
        description: ' New post is created and is visible in the feed.',
      });
      form.reset();
      if (onPostAdded) {
        onPostAdded();
      }
    },
  });

  const onSubmit = (data: AddPostFormData) => {
    // Dummy userId for now, replace with actual user ID 
    addPostMutation.mutate({ ...data, userId: 1 }); 
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        className="mb-6 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the community</p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your post title..." 
                    {...field} 
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What's on your mind?" 
                    {...field} 
                    className="min-h-[120px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={addPostMutation.isPending}
              className="bg-black text-white hover:bg-gray-900 px-8"
            >
              {addPostMutation.isPending ? 'Adding...' : 'Add Post'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleBack}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPostForm;