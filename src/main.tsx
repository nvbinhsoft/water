import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { setupMockApi } = await import('./mocks/setupMockApi');
    setupMockApi();
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

bootstrap();
