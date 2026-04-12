import React, { useContext, useState } from 'react';
import Cards from '../components/cards/cards';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BasketContext from '../hooks/basketContext';
import { BasketContextType } from '../types';
import './products.scss';

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
    <Container className="products-page px-3 py-4 py-md-5">
      <header className="products-page__header">
        <h1 className="products-page__title">Products</h1>
        <p className="products-page__subtitle">
          <span className="products-page__subtitle-text">
            Find something you love - search by name or browse the grid.
          </span>
        </p>
      </header>

      <Row>
        <Col>
          <div className="products-page__search">
            <div className="products-page__search-inner">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="products-page__search-icon" aria-hidden />
              <Form.Label htmlFor="product-search" className="visually-hidden">
                Search products by name or description
              </Form.Label>
              <Form.Control
                id="product-search"
                type="text"
                name="product-search"
                className="products-page__search-input"
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row xs={2} md={4} className="products-page__grid g-3 g-md-4">
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
