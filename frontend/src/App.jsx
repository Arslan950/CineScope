import './App.css'
import { useEffect } from 'react'
import NavBar from './components/NavBar'
import SecondryNavBar from './components/SecondryNavBar.jsx'
import Footbar from './components/Footbar'
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom'
import { useThemeStore } from './store/ThemeStore'
import { useAuthStore } from './store/AuthStore'
import { ToastContainer, toast } from 'react-toastify'
import Loading from "./components/Loading.jsx"

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { checkAuth, isLoading, isLoggedIn } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light');
    document.querySelector('html').classList.add(theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <main className='min-h-screen w-screen dark:bg-[#111826] bg-slate-100 dark:text-white text-black font-Poppins flex flex-col sm:duration-300'>
      {(isLoggedIn) ? <NavBar /> : <SecondryNavBar/>}
      <section className='flex flex-grow flex-col items-center'>
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
          theme="dark"
        />
        <Outlet />
      </section>
      <Footbar />
      <ScrollRestoration />
    </main>
  )
}

export default App