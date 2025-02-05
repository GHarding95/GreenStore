import React, { useContext } from 'react';
import Cards from '../components/cards/cards';
import { Container, Row, Col } from 'react-bootstrap';
import BasketContext from '../hooks/basketContext';
import { BasketContextType } from '../types';

interface ProductsProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Products: React.FC<ProductsProps> = ({ setCount }) => {
  const { cards } = useContext<BasketContextType>(BasketContext);

  return (
    <Container className='p-5 px-3'>
      <Row>
        {cards.map((card, index) => (
          <Col key={index} md={3}>
            <Cards
              imageSrc={card.imageSrc}
              title={card.title}
              text={card.text}
              price={card.price}
              currency={card.currency}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;