import React, { useEffect, useState, useRef } from 'react';
import './navigation.scss';
import logo from '../../assets/greenstore_logo.png';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
} from 'mdb-react-ui-kit';
import { useContext } from 'react';
import BasketContext from '../../hooks/basketContext';

interface NavigationProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Navigation: React.FC<NavigationProps> = ({ count, setCount }) => {
  const { basketCount, setBasketCount } = useContext(BasketContext);
  const [showNavText, setShowNavText] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateCartCount = () => {
      const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const totalCount = existingCartItems.reduce((total: number, cartItem: { quantity: number }) => total + cartItem.quantity, 0);
      setBasketCount(totalCount);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, [setBasketCount]);

  const toggleMobileMenu = () => {
    setShowNavText(false);
    setMobileMenuOpen((open) => !open);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    mobileCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

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
            <NavLink
              className='basket-wrapper nav-link'
              to='/basket'
              aria-label={
                basketCount === 0
                  ? 'View basket, empty'
                  : `View basket, ${basketCount} ${basketCount === 1 ? 'item' : 'items'}`
              }
            >
              <span className="basket-nav-icon">
                <FontAwesomeIcon icon={faShoppingCart} className="basket-nav-icon__svg" aria-hidden />
                <span
                  id="basket-count"
                  className="basket-nav-icon__badge"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {basketCount}
                </span>
              </span>
            </NavLink>
            
            <MDBNavbarToggler
              type='button'
              className='mobile-toggle'
              aria-controls='mobile-navigation-dialog'
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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

      <div
        id="mobile-navigation-dialog"
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-links">
          <button
            ref={mobileCloseRef}
            type="button"
            className="close-mobile-menu"
            aria-label="Close menu"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </button>
          <NavLink className='nav-link' to='/' onClick={toggleMobileMenu}>
            Home
          </NavLink>
          <NavLink className='nav-link' to='/about' onClick={toggleMobileMenu}>
            About
          </NavLink>
          <NavLink className='nav-link' to='/products' onClick={toggleMobileMenu}>
            Products
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
