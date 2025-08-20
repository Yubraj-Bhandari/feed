
import { Routes, Route, Navigate } from "react-router-dom";
import Feed from "./components/features/posts/Feed";
import SinglePostView from "./components/features/posts/SinglePostView";
import AddPostForm from "./components/features/posts/AddPostForm";
import Login from "./components/features/auth/Login";
import Signup from "./components/features/auth/Signup";
import { useAuth } from "./contexts/AuthContext";
import { type ReactElement } from "react";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/new"
        element={
          <PrivateRoute>
            <AddPostForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/:postId"
        element={
          <PrivateRoute>
            <SinglePostView />
          </PrivateRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
