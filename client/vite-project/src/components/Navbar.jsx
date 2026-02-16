import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? "active" : "";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BidBazaar</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className={isActive("/")}>Auctions</Link>
        <Link to="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link>
        {user && (
          <>
            <Link to="/create" className={isActive("/create")}>+ Create</Link>
            <Link to="/my-bids" className={isActive("/my-bids")}>My Bids</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
