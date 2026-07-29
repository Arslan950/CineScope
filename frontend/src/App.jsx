import './App.css'
import { useEffect } from 'react'
import NavBar from './components/NavBar'
import SecondryNavBar from './components/SecondryNavBar.jsx'
import Footbar from './components/Footbar'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useThemeStore } from './store/ThemeStore'
import { useAuthStore } from './store/AuthStore.js';
import { useFavouritesStore } from './store/FavouritesStore.js'
import { ToastContainer, toast } from 'react-toastify'
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
    <main className='min-h-screen w-screen dark:bg-[#111826] bg-slate-100 dark:text-white text-black font-Poppins flex flex-col sm:duration-300'>
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
      {(isLoggedIn) ? <NavBar /> : <SecondryNavBar />}
      <section className='flex flex-grow flex-col items-center'>
        <Outlet />
      </section>
      <Footbar />
      <ScrollRestoration />
    </main>
  )
}

export default App