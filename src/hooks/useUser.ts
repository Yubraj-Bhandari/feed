import {useQuery} from '@tanstack/react-query';
import {fetchUser} from '../lib/api';
import { userSchema } from '@/schemas/user';

//hook to fetch a single user
export function useUser(userId:number){
    return useQuery({
        queryKey:['user',,userId], //cache key (unique per user)
        queryFn:async ()=>{
            try{
                const data = await fetchUser(userId)
                return userSchema.parse(data) //validate with zod
            }catch(error){
                // console.log(` Error fetching user ${userId}:`,error);
                throw new Error('Failed to fetch user information')
            }
        },
        enabled: !!userId && userId >0 , //only run if userID is valid 
        staleTime: 10* 60*1000, //10 minutes (kinaki users dont change often)

        // !!userId && userId > 0
// The double exclamation marks !! are used to convert a value to a boolean.
// So this whole expression will be true only if userId exists and is greater than 0.
// Otherwise, it will be false.
    })
}