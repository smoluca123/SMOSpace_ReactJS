import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from '@/modules/home/pages/HomePage';
import MainLayout from '@/components/layouts/MainLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { HeroUIProvider } from '@heroui/system';
import AuthPage from '@/modules/auth/pages/AuthPage';
import Login from '@/modules/auth/components/Login';
import Register from '@/modules/auth/components/Register';
import SearchPage from '@/modules/search/page';
import ProfilePage from '@/modules/profile/pages/ProfilePage';
import { GenneralSettingPage, ProfileSettingPage, SettingPage } from '@/modules/setting/pages';
import useNotificationSocket from '@/hooks/useNotifiicationSocket';
import ForgetPassword from '@/modules/auth/components/ForgetPassword';
import PostDetailPage from '@/modules/post-detail/pages/PostDetailPage';
import FriendsPage from '@/modules/friends/pages/FriendsPage';

const router = createBrowserRouter(
  [
    // Main layout
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // Home page
        {
          index: true,
          element: <HomePage />,
        },
        // Search page
        {
          path: '/search',
          element: <SearchPage />,
        },
        // Post detail page
        {
          path: '/post/:postId',
          element: <PostDetailPage />,
        },

        // Friends page
        {
          path: '/friends',
          element: <FriendsPage />,
        },
      ],
    },
    // Auth page
    {
      path: '/auth',
      element: <AuthPage />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'forget-password',
          element: <ForgetPassword />,
        },
      ],
    },

    // Profile page
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '/profile/:username',
      element: <ProfilePage />,
    },

    // Settings page
    {
      path: '/settings',
      element: <SettingPage />,
      children: [
        {
          index: true,
          element: <GenneralSettingPage />,
        },
        {
          path: 'profile',
          element: <ProfileSettingPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
    },
  },
);

function App() {
  useNotificationSocket();
  return (
    <HeroUIProvider>
      <ThemeProvider defaultTheme='dark'>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ThemeProvider>
    </HeroUIProvider>
  );
}

export default App;
