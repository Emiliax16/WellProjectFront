import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, loading, loadingIcon, isAdmin, isCompany, isDistributor } = useAuth();

  if (loading) {
    return <div>{loadingIcon}</div>;
  }

  const roleCheck = user && (
    (roles.includes('admin') && isAdmin) ||
    (roles.includes('company') && isCompany) ||
    (roles.includes('normal') && !isAdmin && !isCompany && !isDistributor) ||
    (roles.includes('distributor') && isDistributor)
  );  

  return roleCheck ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
