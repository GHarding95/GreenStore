import React from 'react';
import './footer.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Navbar bg="success" expand='false'>
        <Container className='d-inline'>     
          <div>
            &#169; {currentYear} Glen Harding
          </div>
        </Container>
      </Navbar>
    </footer> 
  )
}
