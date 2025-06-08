import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../store/CartContext';

export default function MenuItem({ item }) {
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  
  function handleAddToCart(e) {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    cartCtx.addItem(item);
  }

  function handleItemClick() {
    navigate(`/food/${item.id}`);
  }
  
  return (
    <div className="meal-item" onClick={handleItemClick}>
      <article>
        <div className="meal-item-image-container">
          <img src={item.image} alt={item.name} />
          <div className="meal-item-overlay">
            <span>Click to view details</span>
          </div>
        </div>
        <h3>{item.name}</h3>
        <p className="meal-item-description">{item.description}</p>
        <p className="meal-item-price">${item.price.toFixed(2)}</p>
        <div className="meal-item-actions">
          <button className="button quick-add-btn" onClick={handleAddToCart}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Quick Add
          </button>
        </div>
      </article>
    </div>
  );
} 