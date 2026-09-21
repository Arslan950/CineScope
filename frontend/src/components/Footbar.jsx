import React from 'react';
import { Mail, LinkedinIcon, GithubIcon } from 'lucide-react'

const Footbar = () => {

  const Footerlinks = [
    {
      link: "https://github.com/Arslan950",
      title: "Github",
      icon: <GithubIcon />
    },
    {
      link: "https://www.linkedin.com/in/mohammad-arslan-393928287",
      title: "LinkedIn",
      icon: <LinkedinIcon />
    },
    {
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=arslan48950@gmail.com",
      title: "Mail",
      icon: <Mail />
    }
  ];

  return (
    <footer>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {Footerlinks.map((link) => (
            <a
              key={link.title}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{link.title}</span>
              {link.icon}
            </a>
          ))}
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base">
            &copy; {new Date().getFullYear()} CineScope. Your lens into the world of cinema.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(Footbar);
