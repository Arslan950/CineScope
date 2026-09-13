import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { useThemeStore } from '../store/ThemeStore';
import fallBack from '../assets/fallBack.png';

export function useAccount() {
  const navigate = useNavigate();

  const theme = useThemeStore((state) => state.theme);
  const darkTheme = useThemeStore((state) => state.darkTheme);
  const lightTheme = useThemeStore((state) => state.lightTheme);
  const user = useAuthStore((state) => state.user);
  const loggedOut = useAuthStore((state) => state.loggedOut);

  const avatar = user?.avatar || "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png" || fallBack;
  const userName = user?.fullName || 'CineScope User';

  const onToggleTheme = () => (theme === 'dark' ? lightTheme() : darkTheme());

  const handleLogout = () => {
    loggedOut().then(() => navigate('/login'));
  };

  return { theme, avatar, userName, onToggleTheme, handleLogout };
}