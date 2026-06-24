import './App.css'
import { useEffect } from 'react'
import NavBar from './components/NavBar'
import Footbar from './components/Footbar'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from './store/ThemeStore'


function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light');
    document.querySelector('html').classList.add(theme);
  }, [theme])

  return (


      <main className='min-h-screen w-screen dark:bg-[#111826] bg-slate-100 dark:text-white text-black font-Poppins flex flex-col sm:duration-300' >
        <NavBar />
        <section className=' flex flex-grow flex-col items-center'>
          <Outlet />
        </section>
        <Footbar />
      </main>

  )
}

export default App
