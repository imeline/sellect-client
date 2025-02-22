// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function ProtectedRoute({ allowedRoles }) {
  const { isLoggedIn, role } = useAuth();

  console.log("ProtectedRoute", isLoggedIn, role);

  if (isLoggedIn) {
    return <Navigate to={role === 'USER' ? '/home' : '/seller'} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;