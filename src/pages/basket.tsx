import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface BasketItem {
  imageSrc: string;
  title: string;
  text: string;
  price: number;
  currency: string;
  quantity: number;
}

const Basket: React.FC = () => {
  const [savedItems, setSavedItems] = useState<BasketItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const MAX_QUANTITY = 99;

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);

  const updateQuantity = (item: BasketItem, newQuantity: number) => {
    const updatedItems = savedItems.map((savedItem) =>
      savedItem.title === item.title ? { ...savedItem, quantity: newQuantity } : savedItem
    );

    setSavedItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const handleIncreaseQuantity = (item: BasketItem) => {
    if (item.quantity < MAX_QUANTITY) {
      updateQuantity(item, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (item: BasketItem) => {
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1);
    } else {
      handleRemoveItem(item);
    }
  };

  const handleRemoveItem = (item: BasketItem) => {
    const updatedItems = savedItems.filter((basketItem) => basketItem.title !== item.title);
    setSavedItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const basketIsEmpty = savedItems.length === 0;

  return (
    <div className="container p-5 px-3" role="main">
      {!basketIsEmpty && <h3 className="mb-4">Your Basket</h3>}
      {basketIsEmpty ? (
        <h3 className="text-center">Your basket is empty.</h3>
      ) : (
        <>
          {savedItems.map((item) => (
            <div className="col" key={item.title}>
              <div className="card">
                <div className="row g-0">
                  <div className="col-md-3">
                    <LazyLoadImage
                      src={item.imageSrc}
                      alt={item.title}
                      className="card-img basket-img"
                      style={{ width: '100%' }}
                      effect="blur"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.text}</p>
                      <p className="fw-bold">Price: ${item.price} {item.currency}</p>
                      <div className="quantity-container d-flex align-items-center">
                        <Button
                          variant="outline-success"
                          className="btn-sm me-2"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <span className="fw-bold">{item.quantity}</span>
                        <Button
                          variant="outline-success"
                          className="btn-sm ms-2"
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={item.quantity >= MAX_QUANTITY}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="d-flex flex-column align-items-center">
        <div className="text-center mt-4 basket-btn">
          <Link to="/products">
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Continue Shopping
            </button>
          </Link>

          {!basketIsEmpty && (
            <button className="btn btn-primary mt-3" onClick={handleCheckout}>
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Checkout
            </button>
          )}
        </div>
      </div>

      {!basketIsEmpty && (
        <div className="text-center mt-4">
          <h4>
            Total: ${savedItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} {savedItems[0]?.currency}
          </h4>
        </div>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your order has been placed successfully.</p>
          <p>We appreciate your purchase!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Basket;
