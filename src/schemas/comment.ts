import {z} from 'zod'
//comment ko data structure

//object schema banayo naya
export const commentSchema= z.object({
    postId:z.number(),
    id:z.number(),
    name:z.string(),
    email:z.email(),
    body:z.string(),

})

export const commentsArraySchema= z.array(commentSchema);
export type Comment =z.infer<typeof commentSchema>
