import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
<<<<<<< HEAD
  const { user, loading, loadingIcon, isAdmin, isCompany } = useAuth();
=======
  const { user, loading, loadingIcon, isAdmin, isCompany, isDistributor } = useAuth();
>>>>>>> 75af84f2f32aa9596caf510a245708e3b5f14d56

  if (loading) {
    return <div>{loadingIcon}</div>;
  }

<<<<<<< HEAD

  const roleCheck = user && (
    (roles.includes('admin') && isAdmin) ||
    (roles.includes('company') && isCompany)
=======
  const roleCheck = user && (
    (roles.includes('admin') && isAdmin) ||
    (roles.includes('company') && isCompany) ||
    (roles.includes('normal') && !isAdmin && !isCompany && !isDistributor)
>>>>>>> 75af84f2f32aa9596caf510a245708e3b5f14d56
  );  

  return roleCheck ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
