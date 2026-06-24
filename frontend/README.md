<div align="center">
<img src="./src/assets/logo.svg" alt="CineScope Logo" width="100" />

# CineScope

_Experience Cinema Like Never Before_

<br>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/Arslan950/CineScope---ReactProject?style=flat&logo=git&logoColor=white&color=0080ff">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/Arslan950/CineScope---ReactProject?style=flat&color=0080ff">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/Arslan950/CineScope---ReactProject?style=flat&color=0080ff">

<br>
<br>

_Built with the tools and technologies:_

<br>

<a href="https://react.dev/" target="_blank"><img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" /></a>&nbsp;&nbsp;&nbsp;<a href="https://vitejs.dev/" target="_blank"><img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;<a href="https://tailwindcss.com/" target="_blank"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/pmndrs/zustand" target="_blank"><img alt="Zustand" src="https://img.shields.io/badge/Zustand-443E38?style=flat&logo=react&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;<a href="https://axios-http.com/" target="_blank"><img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" /></a>

<a href="https://www.framer.com/motion/" target="_blank"><img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;<a href="https://ui.aceternity.com/" target="_blank"><img alt="Aceternity UI" src="https://img.shields.io/badge/Aceternity_UI-222222?style=flat&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;<a href="https://daisyui.com/" target="_blank"><img alt="DaisyUI" src="https://img.shields.io/badge/DaisyUI-1AD1A5?style=flat&logo=daisyui&logoColor=white" /></a>

</div>

---

CineScope is a sleek and modern web application designed for movie enthusiasts. It offers a rich user interface for discovering, searching, and managing your favorite films. With its intuitive design and powerful features, CineScope provides a seamless experience for exploring the world of cinema.

## **Features**

* **Modern UI/UX:** A visually appealing and user-friendly interface that enhances the movie browsing experience.
* **Movie Discovery:** Explore a comprehensive database of movies, including detailed information, ratings, and posters.
* **Advanced Search:** Easily find any movie with the powerful and intuitive search functionality.
* **Favorites Management:** Create a personalized collection of your favorite movies and manage them with ease.
* **Theming:** Switch between **light and dark modes** for a comfortable viewing experience in any lighting condition.
* **Responsive Design:** Enjoy a fully responsive layout that works seamlessly on desktops, tablets, and mobile devices.

## **Technologies Used**

* **React:** A JavaScript library for building user interfaces.
* **React Router:** For handling client-side routing.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Zustand:** A state management tool used for current theme and favourites list.
* **Framer Motion:** For creating fluid and complex animations.
* **OMDb API:** To fetch detailed movie information.
* **Daisy UI:** A component library for Tailwind CSS.
* **Aceternity UI:** A collection of modern UI components.
* **Lucide Icons:** A clean and consistent icon set.

## **Getting Started**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

Make sure you have Node.js and npm installed on your machine.

* npm
    ```sh
    npm install npm@latest -g
    ```

### **Installation**

1.  Clone the repo
    ```sh
    git clone https://github.com/Arslan950/CineScope.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Enter your API Key in a `.env` file
    ```JS
    VITE_OMDB_API_KEY = 'YOUR API KEY'
    ```
4.  Run the application
    ```sh
    npm run dev
    ```

## Project Structure

```text
CineScope/
├── src/
│   ├── animation/       # Lottie JSON animations
│   ├── assets/          # Static assets (Logos, Images)
│   ├── components/      # Reusable UI components
│   │   ├── Cards/       # Movie display cards
│   │   ├── ui/          # Aceternity/Primitive UI elements
│   │   └── ...
│   ├── hooks/           # Custom hooks (useFetchDetails)
│   ├── MoviesDB/        # Static movie lists (Trending, Bollywood)
│   ├── Pages/           # Application Views (Home, Explore, MovieDetail)
│   ├── store/           # Zustand state management (Theme, Favourites)
│   ├── App.jsx          # Main layout structure
│   └── main.jsx         # Entry point & Routing
└── ...
```







## **Contact**

Email : arslan48950@gmail.com

Project Link : [https://cinescope-liart-eight.vercel.app/](https://cinescope-liart-eight.vercel.app/)
