import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }


  const roleCheck = user && roles.includes(user.roleId === 1 ? 'admin' : 'regular');

  return roleCheck ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
