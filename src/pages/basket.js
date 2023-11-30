import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Basket() {
  const [savedItems, setSavedItems] = useState([]);
  const [isQuantityChanged, setIsQuantityChanged] = useState({});

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);

  const handleRemoveItem = (item) => {
    setSavedItems((prevItems) => prevItems.filter((basketItem) => basketItem.title !== item.title));
    console.log('Removed Item:', item);

    // Retrieve existing cart items from local storage
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Filter out the removed item from the existing cart items
    const updatedCartItems = existingCartItems.filter((cartItem) => cartItem.title !== item.title);

    // Store the updated cart items in local storage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // Calculate the updated count
    const totalCount = updatedCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

    // Update the count in the navigation immediately
    const countElement = document.getElementById('basket-count');
    if (countElement) {
      countElement.textContent = totalCount;
    }
  };

  const handleQuantityChange = (item, event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      const updatedQuantity = {
        ...isQuantityChanged,
        [item.title]: newQuantity !== item.quantity,
      };
      setIsQuantityChanged(updatedQuantity);
      const updatedItems = savedItems.map((savedItem) => {
        if (savedItem.title === item.title) {
          return {
            ...savedItem,
            quantity: newQuantity,
          };
        }
        return savedItem;
      });
      setSavedItems(updatedItems);
    }
  };

  const handleUpdateQuantity = (item) => {
    localStorage.setItem('cartItems', JSON.stringify(savedItems));
    const totalCount = savedItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    const countElement = document.getElementById('basket-count');
    if (countElement) {
      countElement.textContent = totalCount;
    }
    const updatedQuantity = {
      ...isQuantityChanged,
      [item.title]: false,
    };
    setIsQuantityChanged(updatedQuantity);
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
                      effect='blur'
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.text}</p>
                      <div className='quantity-container'>
                        <div>
                          <p className="card-text fw-bold mt-3">
                            Quantity:
                            <input
                              type="number"
                              className="form-control"
                              value={item.quantity}
                              onChange={(event) => handleQuantityChange(item, event)}
                              onKeyDown={() => handleUpdateQuantity(item)}
                            />
                          </p>
                        </div>
                        <div className='quantity-btns'>
                        <Button className="btn-sm me-2" variant='success' onClick={() => handleUpdateQuantity(item)} disabled={!isQuantityChanged[item.title]} >
                          Update
                        </Button>
                        <Button className="btn-sm" variant='danger' onClick={() => handleRemoveItem(item)}>
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
      <div className='d-flex flex-column align-items-center'>
        <div className="text-center mt-4 basket-btn">
          <Link to="/products">
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className='me-2'/>
              Continue Shopping
            </button>
          </Link>

          {!basketIsEmpty && (
          <Link to="#">
            <button className="btn btn-primary mt-3">
            <FontAwesomeIcon icon={faShoppingCart} className='me-2'/>
              Checkout
            </button>
          </Link>
          )}

        </div>
      </div>        
    </div>
  );
}
