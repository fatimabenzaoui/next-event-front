import './App.css';
import { CssBaseline, Box } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import SideNav from './components/SideNav';
import SideNavHome from './components/SideNavHome';
import TopNav from './components/TopNav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router/routes';
import { ToastContainer } from 'react-toastify';
import { EventProvider } from './pages/events/EventContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

// Composant interne pour utiliser useLocation
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <>
      <TopNav />
      <Box sx={styles.container}>
        {location.pathname === '/' ? <SideNavHome /> : <SideNav />}
        <Box component={'main'} sx={styles.mainSection}>
          <AppRoutes />
        </Box>
      </Box>
    </>
  );
}

function App() {
  return (
    <React.Fragment>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ProSidebarProvider>
        <AuthProvider>
          <EventProvider>
            <CssBaseline />
            <BrowserRouter basename="/next-event-front">
              <AppContent />
            </BrowserRouter>
          </EventProvider>
        </AuthProvider>
      </ProSidebarProvider>
      </GoogleOAuthProvider>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;

/** @type {import("@mui/material").SxProps} */
const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#f7f6fbff',
    height: 'calc(100% - 64px)'
  },
  mainSection: {
    p: 4,
    width: '100%',
    height: '100%',
    overflow: 'auto'
  }
};
