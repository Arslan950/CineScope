import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Dashboard = lazy(() => import('./Pages/Dashboard.jsx'));
const Favourites = lazy(() => import('./Pages/Favourites.jsx'));
const NotFound = lazy(() => import('./Pages/NotFound.jsx'));
const Search = lazy(() => import('./Pages/Search.jsx'));
const MoviesDetail = lazy(() => import('./Pages/Movie/MoviesDetail.jsx'));
const MovieDescription = lazy(() => import('./Pages/Movie/MovieDescription.jsx'));
const Home = lazy(() => import('./Pages/Home.jsx'));
const Explore = lazy(() => import('./Pages/Explore.jsx'));
const Login = lazy(() => import('./Pages/Login.jsx'));
const SignUp = lazy(() => import('./Pages/SignUp.jsx'));
const ForgetPassword = lazy(() => import('./Pages/Password/ForgetPassword.jsx'))
const PasswordMain = lazy(() => import('./Pages/Password/PasswordMain.jsx'))
const ResetPassword = lazy(() => import('./Pages/Password/ResetPassword.jsx'))
const EmailVerification = lazy(() => import('./Pages/Email/EmailVerification.jsx'));
const EmailMain = lazy(() => import('./Pages/Email/EmailMain.jsx'))
const Loading = lazy(() => import('./components/Loading.jsx'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "home",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<Loading />}>
            <Favourites />
          </Suspense>
        ),
      },
      {
        path: "Search",
        element: (
          <Suspense fallback={<Loading />}>
            <Search />
          </Suspense>
        ),
      },
      {
        path: "explore",
        element: (
          <Suspense fallback={<Loading />}>
            <MoviesDetail />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <Explore />
              </Suspense>
            ),
          },
          {
            path: ":title",
            element: (
              <Suspense fallback={<Loading />}>
                <MovieDescription />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "verify-email",
        element: (
          <Suspense fallback={<Loading />}>
            <EmailMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <NotFound />
              </Suspense>
            )
          },
          {
            path: ":emailVerificationToken",
            element: (
              <Suspense fallback={<Loading />}>
                <EmailVerification />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<Loading />}>
            <SignUp />
          </Suspense>
        )
      },
      {
        path: "forgetPassword",
        element: (
          <Suspense fallback={<Loading />}>
            <ForgetPassword />
          </Suspense>
        )
      },
      {
        path: "resetPassword",
        element: (
          <Suspense fallback={<Loading />}>
            <PasswordMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <NotFound />
              </Suspense>
            )
          },
          {
            path: ":resetPasswordToken",
            element: (
              <Suspense fallback={<Loading />}>
                <ResetPassword />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
