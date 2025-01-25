import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import userSessionStore from '../../lib/userSessionStore';
import { toast } from 'react-toastify';

const Header = () => {

  const logout = userSessionStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged Out Successfully")
    } catch (error) {
      toast.error("Failed to Log Out")
      // alert("Failed to log out: " + error.message);
    }
  };

  return (
    <header className="header">
      <div className="logo">Logo</div>
      <div className="home">
        <Link to="/homepage">HOME</Link>
      </div>
      <div className="reviews">
        <Link to="/reviews">REVIEWS</Link>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="Search..." />
        <img
          className="search-icon"
          src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-18.png"
          alt="search"
        />
      </div>
      <div className="profile">
        <Link to="/profile">
          <img
            className="profile-photo"
            src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
            alt="profile"
          />
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
