import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import Loading from './Loading';

const PublicRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (isLoggedIn) return <Navigate to="/home" replace />;

  return children;
};

export default PublicRoute;