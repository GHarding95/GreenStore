import React from 'react';
import './footer.scss';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo">
      <Navbar className='footer-background' expand='false'>
        <Container className='d-inline'>     
          <div>
            &#169; {currentYear} Glen Harding
          </div>
        </Container>
      </Navbar>
    </footer> 
  );
};

export default Footer;