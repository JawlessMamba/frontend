import { Navigate } from "react-router-dom";
import { useGetCurrentUser } from "../../../api/client/user";
import LoadingSpinner from "../common/LoadingSpinner";

// Wrap admin-only pages. The backend enforces this too; this just keeps
// non-admins from landing on a page they can't use.
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const { data: user, isLoading } = useGetCurrentUser();

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking access..." />
      </div>
    );
  }
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
