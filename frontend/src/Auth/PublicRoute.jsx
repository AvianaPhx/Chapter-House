import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PublicRoute = ({ restricted = false }) => {
  const { currentUser } = useAuth();

  if (currentUser && restricted) {
    return <Navigate to="/home" replace />;
  }

  if (currentUser && window.location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;