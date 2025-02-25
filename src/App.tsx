import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from '@/modules/home/pages/HomePage';
import MainLayout from '@/components/layouts/MainLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NextUIProvider } from '@nextui-org/system';
import AuthPage from '@/modules/auth/pages/AuthPage';
import Login from '@/modules/auth/components/Login';
import Register from '@/modules/auth/components/Register';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import SearchPage from '@/modules/search/page';

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
  return (
    <NextUIProvider>
      <ThemeProvider defaultTheme='dark'>
        <ReactQueryProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </ReactQueryProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default App;
