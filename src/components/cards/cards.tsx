import React, { useState, useContext, useCallback } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import BasketContext from '../../hooks/basketContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../cards/cards.css';
import { ProductCard } from '../../types'; 

interface CardsProps {
  imageSrc: string;
  title: string;
  text: string;
  price: number;
  currency: string;
}

interface CartItem {
  imageSrc: string;
  title: string;
  text: string;
  price: number;
  currency: string;
  quantity: number;
}

const Cards: React.FC<CardsProps> = ({ imageSrc, title, text, price, currency }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { setCards } = useContext(BasketContext);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
  
    // Ensure value stays within 1-99 range
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 99) {
      value = 99;
    }
  
    setQuantity(value);
  };
  
const handleAddToCart = useCallback(
  (item: CartItem) => {
    setCards((prevCards: ProductCard[]) => [...prevCards, { imageSrc, title, text, price, currency }]);

    const existingCartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Update the quantity of the item in the cart or add it as a new item
    const updatedCartItems = existingCartItems.map((cartItem) =>
      cartItem.title === item.title ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
    );

    if (!existingCartItems.some((cartItem) => cartItem.title === item.title)) {
      updatedCartItems.push({ ...item, price, currency });
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    const totalCount = updatedCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

    // Use state to update the basket count dynamically
    const countElement = document.getElementById('basket-count');
    if (countElement) {
      countElement.textContent = totalCount.toString();
    }

    setShowModal(false);
    setShowConfirmation(true);
  },
  [setCards, imageSrc, title, text, price, currency] // ✅ Add dependencies
);


  return (
    <>
      <Card>
        <LazyLoadImage 
          className="card-img-top"
          src={imageSrc} 
          srcSet={`${imageSrc}?w=300 300w, ${imageSrc}?w=600 600w, ${imageSrc}?w=1200 1200w`}
          sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
          onClick={handleOpenModal} 
          alt={title} 
          effect="blur" 
          onKeyPress={(event) => event.key === 'Enter' && handleOpenModal()}
        />
        <Card.Body className="card-body">
          <Card.Title as="h4">{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <Card.Text className="fw-bold">Price: ${price} {currency}</Card.Text>
          <Button variant="success" onClick={handleOpenModal} aria-label={`View details of ${title}`}>
            View Details
          </Button>
        </Card.Body>
      </Card>

      {/* Item Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} role="dialog" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LazyLoadImage src={imageSrc} alt={title} style={{ maxWidth: '100%' }} effect="blur" />
          <p>{text}</p>
          <p><strong>Price:</strong> ${price} {currency}</p>
          <Modal.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <div className='d-flex'>
                <Button
                  variant="success"
                  onClick={() =>
                    handleAddToCart({ imageSrc, title, text, price, currency, quantity })
                  }
                >
                  Add to Basket
                </Button>
                <input
                  type="number"
                  className="card-input"
                  value={quantity}
                  min="1"
                  max="99"
                  onChange={handleQuantityChange}
                  aria-label="Quantity"
                  style={{ width: '70px', marginLeft: '10px' }}
                />
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation} centered role="alertdialog" aria-labelledby="confirmation-title">
        <Modal.Header closeButton>
          <Modal.Title>Item Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>{title}</strong> added to your basket.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseConfirmation}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <div id="basket-count" aria-live="polite" className="sr-only"></div>
    </>
  );
};

export default Cards;