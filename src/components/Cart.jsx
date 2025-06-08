import { useContext, useState } from 'react';
import { CartContext } from '../store/CartContext';
import Modal from './UI/Modal';
import CheckoutForm from './CheckoutForm';
import OrderConfirmation from './OrderConfirmation';

export default function Cart({ onClose }) {
  const cartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const totalAmount = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleCheckout() {
    setIsCheckout(true);
  }

  async function submitOrderHandler(userData) {
    setIsSubmitting(true);
    
    const orderDetails = {
      user: userData,
      orderedItems: cartCtx.items,
      totalAmount: totalAmount
    };
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order: {
            customer: userData,
            items: cartCtx.items,
          },
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      setOrderData(orderDetails);
      setDidSubmit(true);
      cartCtx.clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const cartItems = (
    <ul className="cart-items">
      {cartCtx.items.map((item) => (
        <li key={item.id} className="cart-item">
          <div>
            <h3>{item.name}</h3>
            <div className="cart-item-details">
              <span className="cart-item-price">${item.price.toFixed(2)}</span>
              <span className="cart-item-amount">x {item.quantity}</span>
            </div>
          </div>
          <div className="cart-item-actions">
            <button onClick={() => cartCtx.removeItem(item.id)}>−</button>
            <button onClick={() => cartCtx.addItem(item)}>+</button>
          </div>
        </li>
      ))}
    </ul>
  );

  const modalActions = (
    <div className="modal-actions">
      <button className="text-button" onClick={onClose}>
        Close
      </button>
      {cartCtx.items.length > 0 && (
        <button className="button" onClick={handleCheckout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Checkout
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      <h2>Your Cart</h2>
      {cartCtx.items.length === 0 ? (
        <p className="center">Your cart is empty. Add some delicious meals!</p>
      ) : (
        <>
          {cartItems}
          <div className="cart-total">
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {isCheckout && (
            <CheckoutForm onCancel={onClose} onConfirm={submitOrderHandler} />
          )}
          {!isCheckout && modalActions}
        </>
      )}
    </>
  );

  const isSubmittingModalContent = (
    <div className="center">
      <p>Sending order data...</p>
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <Modal onClose={onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && (
        <OrderConfirmation orderData={orderData} onClose={onClose} />
      )}
    </Modal>
  );
} 