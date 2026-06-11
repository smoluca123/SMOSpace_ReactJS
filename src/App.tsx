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
import useUserPresence from '@/hooks/useUserPresence';
import usePushNotifications from '@/hooks/usePushNotifications';
import ForgetPassword from '@/modules/auth/components/ForgetPassword';
import PostDetailPage from '@/modules/post-detail/pages/PostDetailPage';
import FriendsPage from '@/modules/friends/pages/FriendsPage';
import BookmarksPage from '@/modules/bookmarks/pages/BookmarksPage';
import HashtagPage from '@/modules/hashtag/pages/HashtagPage';
import AdminPage from './modules/admin/pages/AdminPage';
import OverviewPage from './modules/admin/pages/OverviewPage';
import UsersManagementPage from './modules/admin/pages/UsersManagementPage';
import UserDetailManagementPage from './modules/admin/pages/UserDetailManagementPage';
import PostsManagementPage from './modules/admin/pages/PostsManagementPage';
import AnalyticsPage from './modules/admin/pages/AnalyticsPage';
import GroupChatInterface from '@/modules/chat/pages/ChatPage';
import AuthenticationRoute from '@/routes/AuthenticationRoute';
import { useGlobalChatNotifications } from '@/modules/chat/hooks/useChatSocket';
import { CallProvider } from '@/modules/call/CallContext';
import CallOverlay from '@/modules/call/components/CallOverlay';
import CallHistoryPage from '@/modules/call/pages/CallHistoryPage';


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

        // Hashtag feed page
        {
          path: '/tag/:tag',
          element: <HashtagPage />,
        },

        // Friends page
        {
          path: '/friends',
          element: (
            <AuthenticationRoute>
              <FriendsPage />
            </AuthenticationRoute>
          ),
        },

        // Bookmarks page
        {
          path: '/bookmarks',
          element: (
            <AuthenticationRoute>
              <BookmarksPage />
            </AuthenticationRoute>
          ),
        },
      ],
    },

    // Chat page
    {
      path: '/chat/',
      element: (
        <AuthenticationRoute>
          <GroupChatInterface />
        </AuthenticationRoute>
      ),
      children: [
        {
          path: ':id',
          element: (
            <AuthenticationRoute>
              <GroupChatInterface />
            </AuthenticationRoute>
          ),
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
      element: (
        <AuthenticationRoute>
          <SettingPage />
        </AuthenticationRoute>
      ),
      children: [
        {
          index: true,
          element: <GenneralSettingPage />,
        },
        {
          path: 'profile',
          element: <ProfileSettingPage />,
        },
        {
          path: 'call-history',
          element: (
            <AuthenticationRoute>
              <CallHistoryPage />
            </AuthenticationRoute>
          ),
        },
      ],
    },
    {
      path: '/admin',
      element: (
        <AuthenticationRoute roles={['SUPER_ADMIN', 'MODERATOR']}>
          <AdminPage />
        </AuthenticationRoute>
      ),
      children: [
        {
          index: true,
          element: <OverviewPage />,
        },
        {
          path: 'users',
          element: <UsersManagementPage />,
        },
        {
          path: 'users/:username',
          element: <UserDetailManagementPage />,
        },
        {
          path: 'posts',
          element: <PostsManagementPage />,
        },

        {
          path: 'analytics',
          element: <AnalyticsPage />,
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
  useGlobalChatNotifications();
  useUserPresence();
  usePushNotifications();
  return (
    <HeroUIProvider>
      <ThemeProvider defaultTheme='dark'>
        <CallProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
          <CallOverlay />
        </CallProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}

export default App;
