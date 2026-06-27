import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;