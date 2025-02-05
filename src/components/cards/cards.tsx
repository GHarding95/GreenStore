import React, { useState, useContext } from 'react';
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
  

  const handleAddToCart = (item: CartItem) => {
    setCards((prevCards: ProductCard[]) => [...prevCards, { imageSrc, title, text, price, currency }]);

    console.log('Item:', item);

    // Retrieve existing cart items from local storage
    const existingCartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Update the quantity of the item in the cart or add it as a new item
    const updatedCartItems = existingCartItems.map((cartItem) =>
      cartItem.title === item.title ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
    );

    if (!existingCartItems.some((cartItem) => cartItem.title === item.title)) {
      updatedCartItems.push({ ...item, price, currency });
    }

    // Store the updated cart items in local storage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // Calculate the updated count
    const totalCount = updatedCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

    // Update the count in the navigation immediately
    const countElement = document.getElementById('basket-count');
    if (countElement) {
      countElement.textContent = totalCount.toString();
    }    

    // Close the item details modal and show the confirmation modal
    setShowModal(false);
    setShowConfirmation(true);
  };

  return (
    <>
      <Card>
        <LazyLoadImage className="card-img-top" src={imageSrc} onClick={handleOpenModal} alt={title} tabIndex={0} role="button" effect="blur" onKeyPress={(event) => event.key === 'Enter' && handleOpenModal()} />
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