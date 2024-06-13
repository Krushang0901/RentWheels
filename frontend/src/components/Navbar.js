import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
        <img src="RentWheellogo.png" alt="Login Image" />
                </div>
        <div id="mainListDiv" className={`main_list ${menuOpen ? 'show_list' : ''}`}>
          <ul className="navlinks">
            <li><Link to="/LoginSignup">Login</Link></li>

          </ul>
        </div>
        <span className="navTrigger" onClick={toggleMenu}>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
