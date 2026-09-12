import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

/**
 * PrivateRoute — guards all authenticated sections of the app.
 *
 * Behaviour:
 *  - While the initial session check is in flight → show a spinner (prevents
 *    a flash-redirect to /login on page refresh)
 *  - Not authenticated after check → redirect to /login
 *  - Authenticated → render the child route via <Outlet />
 */
export default function PrivateRoute() {
  const { isAuth, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingSpinner message="Checking session..." />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
