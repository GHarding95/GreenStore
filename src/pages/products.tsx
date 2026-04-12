import React, { useContext, useState } from 'react';
import Cards from '../components/cards/cards';
import { Container, Row, Col, Form, Alert, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BasketContext from '../hooks/basketContext';
import { BasketContextType } from '../types';
import './products.scss';

const Products: React.FC = () => {
  const { cards, productsError, productsLoading, refetchProducts } =
    useContext<BasketContextType>(BasketContext);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = () => {
    void refetchProducts({ skipCache: true });
  };

  // Filter the cards based on the search query
  const q = searchQuery.toLowerCase();
  const filteredCards = cards.filter((card) => {
    const title = (card.title ?? '').toLowerCase();
    const text = (card.text ?? '').toLowerCase();
    return title.includes(q) || text.includes(q);
  });

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
                disabled={productsLoading}
                aria-busy={productsLoading}
              />
            </div>
          </div>
        </Col>
      </Row>

      {productsError && (
        <Alert variant="danger" className="products-page__alert" role="alert">
          <p className="mb-2">{productsError}</p>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            onClick={handleRetry}
            disabled={productsLoading}
          >
            Try again
          </Button>
        </Alert>
      )}

      {productsLoading && (
        <div className="products-page__loading" aria-live="polite">
          <Spinner animation="border" role="status" className="products-page__loading-spinner">
            <span className="visually-hidden">Loading products</span>
          </Spinner>
          <span className="products-page__loading-text">Loading products…</span>
        </div>
      )}

      {!productsLoading && !productsError && filteredCards.length === 0 && cards.length > 0 && (
        <p className="products-page__empty">No products match your search.</p>
      )}

      {!productsLoading && !productsError && filteredCards.length > 0 && (
        <Row xs={2} md={4} className="products-page__grid g-3 g-md-4">
          {filteredCards.map((card, index) => (
            <Col key={`${card.title}-${index}`} md={3}>
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
      )}
    </Container>
  );
};

export default Products;
