import {useInfiniteQuery} from '@tanstack/react-query'
import { fetchPosts } from '../lib/api'
import {z} from 'zod';
import { postSchema } from '../schemas/post';

//schema to validate multiple posts
const postsArraySchema= z.array(postSchema)

//understand useInfinityQuery
//manage multiple "pages " of data
//automatically handle loading states
//provide fetchNextPAge function
//cache all fetched pages

//paginated data fetch garxa automatically
export function useInfinitePosts(){
return useInfiniteQuery({
    queryKey:['posts'], //cache key

    //this function runs in each page, harek page ko lagi
    queryFn:async ({pageParam= 1})=>{
             // console.log('📄 Fetching posts page:', pageParam)

        try {
        const data = await fetchPosts(pageParam)
        
        // Validate the response data
        const validatedData = postsArraySchema.parse(data)
        // console.log(`Fetched ${validatedData.length} posts for page ${pageParam}`)
        
        return validatedData
      } catch (error) {
        // console.error(' Error fetching posts:', error)
        throw new Error('Failed to fetch posts. Please try again.')
      }

    },

    //how to determine next page number
    getNextPageParam:(_lastPage,allPages)=>{
        //JSONPlaceholder has 100 posts total, 10 per page= 10 pages max
        return allPages.length <10 ? allPages.length +1: undefined
    },

    initialPageParam:1, //start from page 1
    staleTime:5*60*1000, // 5 minutes
    retry:(failureCount)=>{
        return failureCount < 3 //3 choti samma retry garne
    }
})
}