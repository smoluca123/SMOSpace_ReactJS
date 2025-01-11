import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@/redux/store.ts';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </Provider>
  </StrictMode>,
);
