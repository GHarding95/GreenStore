import React, { useEffect, useState } from 'react';
import './navigation.scss';
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

interface NavigationProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Navigation: React.FC<NavigationProps> = ({ count, setCount }) => {
  const [showNavText, setShowNavText] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateCartCount = () => {
      const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const totalCount = existingCartItems.reduce((total: number, cartItem: { quantity: number }) => total + cartItem.quantity, 0);
      setCount(totalCount);
    };
  
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
  
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, [setCount]);

  const toggleMobileMenu = () => {
    setShowNavText(false);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
    <MDBNavbar expand='lg' className='navbar-top' role="navigation" aria-label="Main navigation">
      <MDBContainer className='nav-container'>
        <div className='nav-left'>
          <NavLink className='navbar-brand logo-container' to='/'>
            <Image src={logo} alt='GreenStore logo' className='responsive-logo' />
          </NavLink>
        </div>

        <div className='nav-middle'>
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
          </MDBCollapse>
        </div>

        <div className='nav-right'>
          <NavLink className='basket-wrapper nav-link' to='/basket' aria-label="View basket">
            <span className='count-wrapper'>
              <span id='basket-count' className='basket-count'>
                {count}
              </span>
              <img src={cart} className='minibasket' alt='shopping cart' />
            </span>
          </NavLink>
          
          <MDBNavbarToggler
            type='button'
            className='mobile-toggle'
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
        </div>
      </MDBContainer>
    </MDBNavbar>

    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="mobile-menu">
      <div className='mobile-links'>
        <div className='close-mobile-menu' onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <NavLink className='nav-link' to='/' onClick={toggleMobileMenu}>
          Home
        </NavLink>
        <NavLink className='nav-link' to='/about' onClick={toggleMobileMenu}>
          About
        </NavLink>
        <NavLink className='nav-link' to='/products' onClick={toggleMobileMenu}>
          Products
        </NavLink>
        {/* <NavLink className='nav-link' to='/basket' onClick={toggleMobileMenu}>
          Basket
        </NavLink> */}
      </div>
    </div>
  </div>
  );
};

export default Navigation;