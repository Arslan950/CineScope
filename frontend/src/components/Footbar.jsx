import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react'

const Footbar = () => {
  return (
    <footer className="dark:bg-[#111826] bg-slate-100 sm:duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://github.com/Arslan950" target='_main' className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300">
            <span className="sr-only">GitHub</span>
            <GithubIcon />
          </a>
          <a href="https://www.linkedin.com/in/mohammad-arslan-393928287/" target='_main' className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300">
            <span className="sr-only">LinkedIn</span>
            <LinkedinIcon />
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=arslan48950@gmail.com" target="_blank" rel="noopener noreferrer"  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300">
            <span className="sr-only">Email</span>
            <MailIcon />
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} CineScope. Your lens into the world of cinema.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footbar
