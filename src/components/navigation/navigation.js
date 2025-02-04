import React, { useEffect, useState } from 'react';
import './navigation.css';
import logo from '../../assets/greenstore_logo.png';
import cart from '../../assets/cart.svg';
import { Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Navigation() {
  const [showNavText, setShowNavText] = useState(false);
  const [count, setCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const totalCount = existingCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      setCount(totalCount);
    };
  
    updateCartCount(); // Run on initial load
  
    // Listen for changes in localStorage (cross-tab support)
    window.addEventListener('storage', updateCartCount);
  
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);
  

  const toggleMobileMenu = () => {
    setShowNavText(false); // Close the old navigation
    setMobileMenuOpen(!mobileMenuOpen); // Toggle the mobile menu
  };

  return (
    <div>
      <MDBNavbar expand='lg' className='navbar-top'>
        <MDBContainer>
          <NavLink className='navbar-brand' to='/'>
            <Image src={logo} alt='logo' width='180px'></Image>
          </NavLink>
          <MDBNavbarToggler
            type='button'
            aria-controls='navbarText'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNavText}>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>

              <MDBNavbarItem>
                <NavLink className='nav-link' to='/'>
                  Home
                </NavLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <NavLink className='nav-link' to='/about'>
                  About
                </NavLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <NavLink className='nav-link' to='/products'>
                  Products
                </NavLink>
              </MDBNavbarItem>

            </MDBNavbarNav>
            <NavLink className='basket-wrapper nav-link' to='/basket'>
              <span className='count-wrapper'>
                <span id='basket-count' className='basket-count'>
                  {count}
                </span>
                <img src={cart} className='minibasket' alt='shopping cart' />
              </span>
            </NavLink>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className='mobile-links'>
          <div className='close-mobile-menu' onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <NavLink className='nav-link' to='/' onClick={toggleMobileMenu}>
            Home
          </NavLink>
          <NavLink className='nav-link' to='/products' onClick={toggleMobileMenu}>
            Products
          </NavLink>
          <NavLink className='nav-link' to='/basket' onClick={toggleMobileMenu}>
            Basket
          </NavLink>
        </div>
      </div>
    </div>
  );
}
