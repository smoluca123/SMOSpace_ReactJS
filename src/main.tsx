import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@/redux/store.ts';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </Provider>,
  // </StrictMode>,
);
