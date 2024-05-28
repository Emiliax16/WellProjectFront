import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, loading, loadingIcon, isAdmin } = useAuth();

  if (loading) {
    return <div>{loadingIcon}</div>;
  }


  const roleCheck = user && roles.includes('admin') && isAdmin;

  return roleCheck ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
