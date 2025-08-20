
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { type Post, postSchema } from '../../../schemas/post';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { toast } from 'sonner';
// import LoadingSpinner from './LoadingSpinner';

const editPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(10, "Body, with minimum 10 characters is required"),
});

type EditPostFormData = z.infer<typeof editPostSchema>;

interface EditPostFormProps {
  post: Post;
  onPostEdited?: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onPostEdited }) => {
  const queryClient = useQueryClient();

  const form = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  });

  useEffect(() => {
    form.reset({
      title: post.title,
      body: post.body,
    });
  }, [post, form]);

  const editPostMutation = useMutation({
    mutationFn: async (updatedPost: Omit<Post, 'id'>) => {
      if (!post) throw new Error('Post not found');
      const response = await api.put(`/posts/${post.id}`, updatedPost);
      return postSchema.parse(response.data);
    },
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPost = queryClient.getQueryData(['post', post.id]);
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['post', post.id], { ...post, ...updatedPost });
      queryClient.setQueryData(['posts'], (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: any) =>
          page.map((p: Post) => (p.id === post.id ? { ...p, ...updatedPost } : p))
        ),
      }));
      return { previousPost, previousPosts };
    },
    onError: (error, _, context) => {
      if (!post) return;
      queryClient.setQueryData(['post', post.id], context?.previousPost);
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error('Failed to update post', {
        description: `Error: ${error.message}. Please try again.`,
      });
    },
    onSettled: () => {
      if (!post) return;
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onSuccess: () => {
      toast.success('Post updated successfully!', {
        description: 'Your post has been updated!',
        className: 'text-green-700',
        icon: <span className="text-green-600">✔️</span>,
      });
      if (onPostEdited) {
        onPostEdited();
      }
    },
  });

  const onSubmit = (data: EditPostFormData) => {
    editPostMutation.mutate({ ...data, userId: post.userId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-lg font-semibold text-gray-700 mb-2">Edit Post</div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600 font-medium">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter post title"
                  {...field}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
              <FormLabel className="text-gray-600 font-medium">Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter post content"
                  {...field}
                  className="min-h-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={editPostMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
          >
            {editPostMutation.isPending ? (
              <span className="flex items-center">
                {/* <LoadingSpinner size="sm" className="mr-2" /> */}
                Updating...
              </span>
            ) : 'Update Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPostForm;