import React, { useContext } from 'react'
import Cards from '../components/cards/cards'
import { Container, Row, Col } from 'react-bootstrap';
import BasketContext from '../hooks/basketContext';

export default function Products() {

  const { cards } = useContext(BasketContext);
  
  return (  
        <Container className='p-5 px-3'>

          
        <Row>
          {cards.map((card, index) => (
            <Col key={index} md={3}>
              <Cards              
                imageSrc={card.imageSrc}
                title={card.title}
                text={card.text}
              />
            </Col>
          ))}
        </Row>
      </Container>
  )
}
