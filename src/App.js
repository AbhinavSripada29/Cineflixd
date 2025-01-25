import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import userSessionStore from './lib/userSessionStore';
import Login from "./pages/login/Login";
import Homepage from './pages/home/Homepage';
import Reviews from './pages/reviews/Reviews';
import ProfilePage from './pages/profile/ProfilePage';
import MovieDetail from './pages/moviedetail/MovieDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const initializeAuth = userSessionStore((state) => state.initializeAuth);
  const user = userSessionStore((state) => state.user);
  const loading = userSessionStore((state) => state.loading);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe; 
  }, [initializeAuth]);


  return (
    <Router>
      <div>
        {/* <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/moviedetail" element={<MovieDetail />} />
        </Routes> */}
        <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={user ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/homepage" element={user ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/reviews" element={user ? <Reviews /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/moviedetail/:id" element={user ? <MovieDetail /> : <Navigate to="/login" />} />

      </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
