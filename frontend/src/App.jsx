import './App.css'
import { useEffect } from 'react'
import NavBar from './components/NavBar'
import SecondryNavBar from './components/SecondryNavBar.jsx'
import Footbar from './components/Footbar'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useThemeStore } from './store/ThemeStore'
import { useAuthStore } from './store/AuthStore.js';
import { useFavouritesStore } from './store/FavouritesStore.js'
import { ToastContainer } from 'react-toastify'
import Loading from "./components/Loading.jsx"

function App() {
  const theme = useThemeStore((state) => state.theme);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hydrateFavouritesList = useFavouritesStore((state) => state.hydrateFavouritesList);

  useEffect(() => {
    const setViewportProperty = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportProperty();

    let windowWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        setViewportProperty();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      hydrateFavouritesList();
    }
  }, [isLoggedIn])

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light');
    document.querySelector('html').classList.add(theme);
  }, [theme]);


  if (isLoading) {
    return <Loading />
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden font-Poppins duration-300 dark:text-white text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#6366f1_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#04060a_40%,#0d1a36_100%)] transition-colors duration-500"
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
        {isLoggedIn ? <NavBar /> : <SecondryNavBar />}
        <section className="flex flex-grow flex-col items-center">
          <Outlet />
        </section>
        <Footbar />
        <ScrollRestoration />
      </div>
    </main>
  )
}

export default App