

import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../ui/button";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic
    alert("Account created! You can now log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-300 via-green-500 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="space-y-6 p-6 sm:p-8 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 text-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              This is just a demo signup page
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 text-base font-medium transition-colors duration-200"
          >
            Create Account
          </Button>

          <div>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}