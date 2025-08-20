//zod= runtime validation of api responses
//schema validation, runtime validation, of data

import {z} from "zod"
//schema for a sinle post

export const postSchema = z.object({
    userId:z.number().min(1), //which user created this post
    id:z.number().min(1),  // unique post identifier id
    title:z.string().min(1,"Title is required"), // post heading
    body:z.string().min(1,"Body is required"), //post content
})
//schema for any 
export const postsArraySchmea= z.array(postSchema)

export type Post= z.infer<typeof postSchema>
