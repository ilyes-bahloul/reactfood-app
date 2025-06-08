export default function OrderConfirmation({ orderData, onClose }) {
  return (
    <div className="order-confirmation">
      <h2>Order Confirmed!</h2>
      <p>Thank you for your order, {orderData.user.name}!</p>
      <p>Your delicious food will be on its way to:</p>
      <address>
        {orderData.user.street}<br />
        {orderData.user['postal-code']} {orderData.user.city}
      </address>
      
      <h3>Order Summary</h3>
      <ul className="order-summary">
        {orderData.orderedItems.map(item => (
          <li key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      
      <div className="order-total">
        <span>Total:</span>
        <span>${orderData.totalAmount.toFixed(2)}</span>
      </div>
      
      <p>A confirmation email has been sent to {orderData.user.email}.</p>
      
      <div className="modal-actions">
        <button className="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
} 