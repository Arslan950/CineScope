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
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `${(theme === "dark") ? "radial-gradient(125% 125% at 50% 10%, #04060a 40%, #0d1a36 100%)" : "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)"}`
        }}
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