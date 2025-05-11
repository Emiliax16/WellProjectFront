import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, loading, loadingIcon, isAdmin, isCompany } = useAuth();

  if (loading) {
    return <div>{loadingIcon}</div>;
  }


  const roleCheck = user && (
    (roles.includes('admin') && isAdmin) ||
    (roles.includes('company') && isCompany)
  );  

  return roleCheck ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
