import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx'; // <-- Added PublicRoute

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
const ForgetPassword = lazy(() => import('./Pages/Password/ForgetPassword.jsx'));
const PasswordMain = lazy(() => import('./Pages/Password/PasswordMain.jsx'));
const ResetPassword = lazy(() => import('./Pages/Password/ResetPassword.jsx'));
const Loading = lazy(() => import('./components/Loading.jsx'));
const Profile = lazy(() => import("./Pages/Profile.jsx"));
const OnBoarding = lazy(() => import("./Pages/OnBoarding.jsx"));

import { GoogleOAuthProvider } from "@react-oauth/google";

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
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Favourites />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "Search",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Search />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "explore",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <MoviesDetail />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <Explore />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ":title",
            element: (
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <MovieDescription />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          </PublicRoute>
        )
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          </PublicRoute>
        )
      },
      {
        path: "forgetPassword",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <ForgetPassword />
            </Suspense>
          </PublicRoute>
        )
      },
      {
        path: "resetPassword",
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <PasswordMain />
            </Suspense>
          </PublicRoute>
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
        path : "profile",
        element : (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path : "onBoarding",
        element : (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <OnBoarding />
            </Suspense>
          </ProtectedRoute>
        )
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);