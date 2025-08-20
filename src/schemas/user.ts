//user data structure
import {z} from 'zod'

//address ko schema
export const addressSchema = z.object({
    street:z.string(),
    suite:z.string(),
    city:z.string(),
    zipcode:z.string(),
})

//user ko schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(), //must be valid email
  address: addressSchema.optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  company: z.object({
    name: z.string(),
  }).optional(),
})
 //types from schemas
export type User= z.infer<typeof userSchema>
export type Address= z.infer<typeof addressSchema>
