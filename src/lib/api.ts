//api layer

import axios from 'axios'

//why axios ko instant? consistent base URL and headers
//create axios instance with interceptors

export const api= axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout:10000, //10 seconds ko timeout
    headers:{
        'Content-Type':'application/json', // all requests send JSON
    }
})
// AXIOS INTERCEPTORS = hooks for requests and responses

// Axios API interceptors are an invaluable tool 
// for managing HTTP requests and responses in your
//  applications. They provide a centralized way to handle
//  errors, manage tokens, log data, and more.

//request interceptor = log outgoing requests
api.interceptors.request.use(
    (config)=>{
        // console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error)=> Promise.reject(error) //forward garney errors 
)

// response interceptor -> log responses, handle errors
api.interceptors.response.use(
  (response) => {
    // console.log(` API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)


//pagination ko parameters
//_page: which page of results(1,2,3,.....)
//_limit: how many items dekhaune per page(10.20,50)


//fetch posts with pagination
export async function fetchPosts(pageParam:number=1) {
    const {data} = await api.get('/posts',{
        params:{
            _page:pageParam, //page number
            _limit:10 //10 posts per page
        },

    })
    return data
    
}

//fetch a single user by ID
export async function fetchUser(userId:number){
    const {data} = await api.get(`/users/${userId}`);
    
    return data
}


//fetch comments for  a specific post 
export async function fetchComments(postId:number){
    const {data}= await api.get(`/posts/${postId}/comments`);
    return data;
}