import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Watchlist from './components/Watchlist'; // Import the Watchlist component
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
  },
});

const AppRouter = () => {
  const location = useLocation();
  const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isLoginOrRegisterPage && (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            <Navbar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </div>
        </div>
      )}
      {isLoginOrRegisterPage && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRouter />
      </Router>
    </ThemeProvider>
  );
};

export default App;