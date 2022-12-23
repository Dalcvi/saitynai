import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SiteNavbar } from './site-navbar';
import { UserProvider } from './user';
import { ModalContextProvider } from './modals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <ModalContextProvider>
            <SiteNavbar />
            <Router />
          </ModalContextProvider>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
