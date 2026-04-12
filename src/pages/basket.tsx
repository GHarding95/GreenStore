import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './basket.scss';

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
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [removeConfirmItem, setRemoveConfirmItem] = useState<BasketItem | null>(null);
  const MAX_QUANTITY = 99;

  const updateCartCount = useCallback(
    (items: BasketItem[]) => {
      const totalCount = items.reduce((total, item) => total + item.quantity, 0);
      setCount(totalCount);
    },
    [setCount]
  );

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      setSavedItems(items);
      updateCartCount(items);
    }
  }, [updateCartCount]);

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
      setRemoveConfirmItem(item);
    }
  };

  const handleRemoveItem = (item: BasketItem) => {
    const updatedItems = savedItems.filter((basketItem) => basketItem.title !== item.title);
    setSavedItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    updateCartCount(updatedItems);
  };

  const handleCheckout = () => {
    console.log(
      'Basket Contents:',
      savedItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (item.price * item.quantity).toFixed(2),
      }))
    );

    setSavedItems([]);
    localStorage.removeItem('cartItems');
    setCount(0);

    setShowCheckoutModal(true);
  };

  const handleCloseCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const handleConfirmRemove = () => {
    if (removeConfirmItem) {
      handleRemoveItem(removeConfirmItem);
      setRemoveConfirmItem(null);
    }
  };

  const handleCancelRemoveConfirm = () => {
    setRemoveConfirmItem(null);
  };

  const basketIsEmpty = savedItems.length === 0;
  const orderTotal = savedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const currencyLabel = savedItems[0]?.currency ?? '';

  return (
    <div className="container">
      {basketIsEmpty ? (
        <div className="basket-page basket-page--empty">
          <div className="basket-empty">
            <div className="basket-empty__visual" aria-hidden="true">
              <span className="basket-empty__icon-ring">
                <FontAwesomeIcon icon={faShoppingCart} className="basket-empty__icon" />
              </span>
            </div>
            <h1 className="basket-empty__title">Your basket is empty</h1>
            <p className="basket-empty__text">
              When you add products from the shop, they will appear here.
            </p>
            <Link
              to="/products"
              className="basket-page__btn basket-page__btn--primary basket-empty__cta"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="basket-page">
          <header>
            <h1 className="basket-page__title">Your basket</h1>
            <p className="basket-page__subtitle">Review your items and adjust quantities before checkout.</p>
          </header>

          <div className="basket-page__list" role="list">
            {savedItems.map((item) => (
              <article className="basket-line" key={item.title} role="listitem">
                <div className="basket-line__media">
                  <LazyLoadImage
                    src={item.imageSrc}
                    alt=""
                    className="basket-line__img"
                    effect="blur"
                  />
                </div>
                <div className="basket-line__body">
                  <h2 className="basket-line__title">{item.title}</h2>
                  <p className="basket-line__desc">{item.text}</p>
                  <p className="basket-line__price">
                    ${item.price.toFixed(2)} {item.currency}
                  </p>
                  <div className="basket-line__controls">
                    <div className="basket-line__qty">
                      <Button
                        variant="outline-success"
                        className="btn-sm"
                        type="button"
                        onClick={() => handleDecreaseQuantity(item)}
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faMinus} aria-hidden />
                      </Button>
                      <span className="basket-line__qty-value">{item.quantity}</span>
                      <Button
                        variant="outline-success"
                        className="btn-sm"
                        type="button"
                        onClick={() => handleIncreaseQuantity(item)}
                        disabled={item.quantity >= MAX_QUANTITY}
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faPlus} aria-hidden />
                      </Button>
                    </div>
                    <Button
                      variant="outline-danger"
                      className="btn-sm basket-line__remove"
                      type="button"
                      onClick={() => setRemoveConfirmItem(item)}
                      aria-label={`Remove ${item.title} from basket`}
                    >
                      <FontAwesomeIcon icon={faTrash} aria-hidden />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="basket-page__summary" aria-label="Order total">
            <span className="basket-page__summary-label">Total</span>
            <span>
              <span className="basket-page__summary-value">${orderTotal.toFixed(2)}</span>
              {currencyLabel ? (
                <span className="basket-page__summary-currency"> {currencyLabel}</span>
              ) : null}
            </span>
          </section>

          <div className="basket-page__actions">
            <Link to="/products" className="basket-page__btn basket-page__btn--ghost">
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
              Continue shopping
            </Link>
            <button type="button" className="basket-page__btn basket-page__btn--primary" onClick={handleCheckout}>
              <FontAwesomeIcon icon={faShoppingCart} aria-hidden />
              Checkout
            </button>
          </div>
        </div>
      )}

      <Modal
        show={showCheckoutModal}
        onHide={handleCloseCheckoutModal}
        centered
        dialogClassName="basket-page__modal-dialog"
        contentClassName="basket-page__modal-content"
      >
        <Modal.Header closeButton className="basket-page__modal-header">
          <Modal.Title>Thank you</Modal.Title>
        </Modal.Header>
        <Modal.Body className="basket-page__modal-body">
          <p className="mb-2">Your order has been placed successfully.</p>
          <p className="mb-0">We appreciate your purchase!</p>
        </Modal.Body>
        <Modal.Footer className="basket-page__modal-footer">
          <Button variant="success" className="basket-page__modal-close basket-page__modal-close--primary" onClick={handleCloseCheckoutModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={removeConfirmItem !== null}
        onHide={handleCancelRemoveConfirm}
        centered
        role="alertdialog"
        aria-labelledby="basket-remove-title"
        aria-describedby="basket-remove-desc"
        dialogClassName="basket-page__modal-dialog"
        contentClassName="basket-page__modal-content"
      >
        <Modal.Header closeButton className="basket-page__modal-header">
          <Modal.Title id="basket-remove-title">Remove item?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="basket-page__modal-body">
          <p id="basket-remove-desc" className="mb-0">
            Remove <strong>{removeConfirmItem?.title}</strong> from your basket?
          </p>
        </Modal.Body>
        <Modal.Footer className="basket-page__modal-footer basket-page__modal-footer--split">
          <Button
            variant="secondary"
            className="basket-page__modal-close"
            type="button"
            onClick={handleCancelRemoveConfirm}
          >
            Cancel
          </Button>
          <Button variant="danger" type="button" onClick={handleConfirmRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Basket;
