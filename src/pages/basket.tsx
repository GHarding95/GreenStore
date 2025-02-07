import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface BasketItem {
  imageSrc: string;
  title: string;
  text: string;
  price: number;
  currency: string;
  quantity: number;
}

interface BasketProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Basket: React.FC<BasketProps> = ({ setCount }) => {
  const [savedItems, setSavedItems] = useState<BasketItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const MAX_QUANTITY = 99;

  // Memoize updateCartCount to avoid unnecessary re-renders
  const updateCartCount = useCallback((items: BasketItem[]) => {
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    setCount(totalCount);
  }, [setCount]); // Add setCount as a dependency

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      setSavedItems(items);
      // Update the count on load
      updateCartCount(items);
    }
  }, [updateCartCount]); // Add updateCartCount to the dependency array

  const updateQuantity = (item: BasketItem, newQuantity: number) => {
    const updatedItems = savedItems.map((savedItem) =>
      savedItem.title === item.title ? { ...savedItem, quantity: newQuantity } : savedItem
    );
    setSavedItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    updateCartCount(updatedItems);
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
    updateCartCount(updatedItems);
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
                    <div className="card-body basket-card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.text}</p>
                      <p className="fw-bold">${item.price} {item.currency}</p>
                      <div className="quantity-container d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
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
                        <Button
                          variant="outline-danger"
                          className="btn-sm ms-auto"
                          onClick={() => handleRemoveItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
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

      {!basketIsEmpty && (
        <div className="text-center mt-4">
          <h4>
            Total: ${savedItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} {savedItems[0]?.currency}
          </h4>
        </div>
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