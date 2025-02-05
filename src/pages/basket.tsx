import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Define the shape of a basket item
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

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);

  const handleRemoveItem = (item: BasketItem) => {
    const updatedItems = savedItems.filter((basketItem) => basketItem.title !== item.title);
    setSavedItems(updatedItems);

    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    const totalCount = updatedItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    const countElement = document.getElementById('basket-count');
    if (countElement) {
      countElement.textContent = totalCount.toString();
    }
  };

  const handleQuantityChange = (item: BasketItem, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(item, newQuantity);
    }
  };

  const updateQuantity = (item: BasketItem, newQuantity: number) => {
    const updatedItems = savedItems.map((savedItem) =>
      savedItem.title === item.title ? { ...savedItem, quantity: newQuantity } : savedItem
    );

    setSavedItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    // Dispatch a storage event to update the navigation bar mini basket
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
    <div className="container p-5 px-3">
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
                      <div className="quantity-container">
                        <div>
                          <p className="card-text fw-bold mt-3">
                            Quantity:
                            <input
                              type="number"
                              className="form-control"
                              value={item.quantity}
                              onChange={(event) => handleQuantityChange(item, event)}
                              onKeyDown={(e) => e.preventDefault()} // Prevent typing
                              min="1"
                              step="1"
                            />
                          </p>
                        </div>
                        <div className="quantity-btns">
                          <Button
                            className="btn-sm"
                            variant="danger"
                            onClick={() => handleRemoveItem(item)}
                          >
                            Remove
                          </Button>
                        </div>
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
            Total: $
            {savedItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}{' '}
            {savedItems[0]?.currency}
          </h4>
        </div>
      )}

      {/* Checkout Confirmation Modal */}
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