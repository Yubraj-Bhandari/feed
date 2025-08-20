

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { AuthProvider } from "./contexts/AuthContext"
// import { BrowserRouter } from 'react-router-dom'

// // Configure React Query
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       retry: (failureCount, error) => {
//         if (error instanceof Error && error.message.includes('404')) {
//           return false
//         }
//         return failureCount < 3
//       },
//       refetchOnWindowFocus: false,
//     },
//     mutations: {
//       retry: 1,
//     },
//   },
// })

// // Set basename dynamically for local dev and production

// const basename = import.meta.env.PROD ? "/feed" : "/"

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <BrowserRouter basename={basename}>
//           <App />
//         </BrowserRouter>
//       </AuthProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   </StrictMode>
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('404')) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Component to handle redirects from 404.html
function RedirectHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('gh-pages-redirect')
    if (redirectPath) {
      sessionStorage.removeItem('gh-pages-redirect')
      // Remove '/feed' from the path to match internal routing
      const cleanPath = redirectPath.startsWith('/feed') ? redirectPath.replace('/feed', '') : redirectPath
      navigate(cleanPath || '/', { replace: true })
    }
  }, [navigate])
  return null
}

// Set basename dynamically for local dev and production
const basename = import.meta.env.PROD ? '/feed' : '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={basename}>
          <RedirectHandler />
          <App />
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)