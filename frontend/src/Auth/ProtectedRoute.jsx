import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // You'll need to create this context

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to a default route based on role
    switch (currentUser.role) {
      case 'Admin':
        return <Navigate to="/admin" replace />;
      case 'Staff':
        return <Navigate to="/staff" replace />;
      case 'Member':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/signin" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;