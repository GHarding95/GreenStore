import React, { useState, useContext, useCallback, memo } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import BasketContext from '../../hooks/basketContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../cards/cards.scss';
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

const Cards: React.FC<CardsProps> = memo(({ imageSrc, title, text, price, currency }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { setCards } = useContext(BasketContext);

  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseConfirmation = useCallback(() => setShowConfirmation(false), []);

  const updateLocalStorage = (updatedCartItems: CartItem[]) => {
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    const totalCount = updatedCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    const countElement = document.getElementById('basket-count');
    if (countElement) countElement.textContent = totalCount.toString();
  };

  const handleAddToCart = useCallback(() => {
    const item = { imageSrc, title, text, price, currency, quantity };
  
    setCards((prevCards: ProductCard[]) => {
      const existingItemIndex = prevCards.findIndex((card) => card.title === item.title);
  
      if (existingItemIndex !== -1) {
        // If the item already exists in the basket, update its quantity
        const updatedCards = [...prevCards];
        updatedCards[existingItemIndex].quantity += item.quantity;
        return updatedCards;
      } else {
        // If the item does not exist in the basket, add it
        return [...prevCards, item];
      }
    });
  
    const existingCartItems: ProductCard[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCartItems = existingCartItems.map((cartItem) =>
      cartItem.title === item.title ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
    );
  
    if (!existingCartItems.some((cartItem) => cartItem.title === item.title)) {
      updatedCartItems.push(item);
    }
  
    updateLocalStorage(updatedCartItems);
    setShowModal(false);
    setShowConfirmation(true);
  }, [setCards, imageSrc, title, text, price, currency, quantity]);

  const handleIncreaseQuantity = () => {
    if (quantity < 99) setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      handleRemoveItem();
    }
  };
  
  const handleRemoveItem = () => {
    const existingCartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCartItems = existingCartItems.filter((cartItem) => cartItem.title !== title);
  
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    window.dispatchEvent(new Event('storage')); // Dispatch the storage event
    setShowModal(false);
  };

  return (
    <>
      <Card className="product-card">
        <LazyLoadImage
          className="card-img-top"
          src={imageSrc}
          srcSet={`${imageSrc}?w=300 300w, ${imageSrc}?w=600 600w, ${imageSrc}?w=1200 1200w`}
          sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
          onClick={handleOpenModal}
          alt={title}
          effect="blur"
          loading="lazy"
          threshold={100}
          visibleByDefault={false}
          placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8vPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=="
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8vPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
          }}
        />
        <Card.Body className="card-body">
          <Card.Title as="h4">{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <Card.Text className="fw-bold">${price} {currency}</Card.Text>
          <div className="mt-auto">
            <Button
              variant="success"
              className="product-btn"
              onClick={handleOpenModal}
              aria-label={`View details of ${title}`}
            >
              View details
            </Button>
          </div>
        </Card.Body>

      </Card>

{/* Item details Modal */}

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          dialogClassName="product-modal__dialog"
          contentClassName="product-modal__content"
          backdropClassName="product-modal__backdrop"
        >
          <Modal.Header closeButton className="product-modal__header">
            <Modal.Title id="modal-title" className="product-modal__title">
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="product-modal__body">
            <div className="modal-image-container product-modal__media">
              <LazyLoadImage 
                src={imageSrc} 
                alt={title} 
                effect="blur" 
                threshold={50}
                visibleByDefault={false}
                placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8vPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=="
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8vPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
                }}
              />
            </div>
            <p className="product-modal__description">{text}</p>
            <p className="product-modal__price">
              <strong>${price} {currency}</strong>
            </p>
            <Modal.Footer className="product-modal__footer">
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 w-100">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <Button
                    variant="success"
                    onClick={handleAddToCart}
                    className="custom-add-to-basket-btn product-modal__add-btn"
                    aria-label={`Add ${title} to basket`}
                  >
                    Add to Basket
                  </Button>
                  <div className="d-flex align-items-center product-modal__qty">
                    <Button variant="outline-success" className="btn-sm" onClick={handleDecreaseQuantity} disabled={quantity === 1}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="quantity-display mx-2"><strong>{quantity}</strong></span>
                    <Button variant="outline-success" className="btn-sm" onClick={handleIncreaseQuantity} disabled={quantity >= 99}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}

{/* Confirmation Modal */}

    {showConfirmation && (
      <Modal
        show={showConfirmation}
        onHide={handleCloseConfirmation}
        centered
        role="alertdialog"
        aria-labelledby="confirmation-title"
        dialogClassName="basket-confirm__dialog"
        contentClassName="product-modal__content basket-confirm__sheet"
        backdropClassName="product-modal__backdrop"
      >
        <Modal.Header closeButton className="basket-confirm__header">
          <Modal.Title id="confirmation-title" className="visually-hidden">
            {title} added to your basket, quantity {quantity}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="basket-confirm__body">
          <div className="basket-confirm__row">
            <div className="basket-confirm__media">
              <LazyLoadImage
                className="basket-confirm__img"
                src={imageSrc}
                alt=""
                effect="blur"
                threshold={50}
                visibleByDefault
                placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8vPjwvc3ZnPg=="
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==';
                }}
              />
            </div>
            <div className="basket-confirm__main">
              <p className="basket-confirm__eyebrow">Added to basket</p>
              <p className="basket-confirm__title">{title}</p>
              <div
                className="basket-confirm__qty"
                role="group"
                aria-label={`Quantity: ${quantity}`}
              >
                <span className="basket-confirm__qty-label">Quantity:</span>
                <span className="basket-confirm__qty-badge">{quantity}</span>
              </div>
            </div>
          </div>
          <Button variant="success" className="basket-confirm__action" onClick={handleCloseConfirmation}>
            Done
          </Button>
        </Modal.Body>
      </Modal>
    )}
    </>
  );
});

export default Cards;
