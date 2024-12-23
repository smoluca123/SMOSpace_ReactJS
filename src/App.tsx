import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from '@/modules/home/pages/HomePage';
import MainLayout from '@/components/layouts/MainLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NextUIProvider } from '@nextui-org/system';
import AuthPage from '@/modules/auth/pages/AuthPage';
import Login from '@/modules/auth/components/Login';
import Register from '@/modules/auth/components/Register';
import ReactQueryProvider from '@/components/ReactQueryProvider';
function App() {
  return (
    <NextUIProvider>
      <ThemeProvider defaultTheme="dark">
        <ReactQueryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
              </Route>
              <Route path="/auth" element={<AuthPage />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ReactQueryProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default App;
