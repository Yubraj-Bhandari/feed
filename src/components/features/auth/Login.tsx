
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Form, FormField, FormLabel, FormMessage } from "../../ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
// import LoadingSpinner from "../../features/posts/LoadingSpinner";

const schema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, { message: "Min 8 characters" }),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800))
    login({ email: data.email }) // Pass user object with email from form data
    navigate("/")
  }

  return (
    <div className="min-h-screen w-full  bg-gradient-to-b from-blue-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6 sm:p-8 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Please sign in to your account
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </FormLabel>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      className="w-full"
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="w-full pr-12"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-base font-medium transition-colors duration-200"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center">
                  {/* <LoadingSpinner size="sm" className="mr-2" /> */}
                  {/* Signing in... */}
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="" 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}