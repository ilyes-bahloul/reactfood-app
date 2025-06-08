import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        {children}
      </div>
    </>,
    document.getElementById('modal')
  );
} 