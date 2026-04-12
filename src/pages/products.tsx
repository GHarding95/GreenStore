import React, { useContext, useState } from 'react';
import Cards from '../components/cards/cards';
import { Container, Row, Col, Form } from 'react-bootstrap';
import BasketContext from '../hooks/basketContext';
import { BasketContextType } from '../types';

interface ProductsProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Products: React.FC<ProductsProps> = ({ setCount }) => {
  const { cards } = useContext<BasketContextType>(BasketContext);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter the cards based on the search query
  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className='products-page p-5 px-3'>
      {/* Search bar */}
      <Row>
        <Col>
          <Form.Label htmlFor="product-search" className="visually-hidden">
            Search products by name or description
          </Form.Label>
          <Form.Control
            id="product-search"
            type="text"
            name="product-search"
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
          />
        </Col>
      </Row>

      {/* Display the cards */}
      <Row xs={2} md={4} className="g-2">
        {filteredCards.map((card, index) => (
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
