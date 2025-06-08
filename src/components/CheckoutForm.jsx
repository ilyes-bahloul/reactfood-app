import { useRef, useState } from 'react';

export default function CheckoutForm({ onCancel, onConfirm }) {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    postalCode: true,
    city: true,
    email: true
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();
  const emailInputRef = useRef();

  function validateEmail(email) {
    return email.includes('@');
  }

  function validatePostalCode(postalCode) {
    return postalCode.trim().length === 5;
  }

  function confirmHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredPostalCode = postalCodeInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;

    const enteredNameIsValid = enteredName.trim() !== '';
    const enteredStreetIsValid = enteredStreet.trim() !== '';
    const enteredCityIsValid = enteredCity.trim() !== '';
    const enteredPostalCodeIsValid = validatePostalCode(enteredPostalCode);
    const enteredEmailIsValid = validateEmail(enteredEmail);

    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      postalCode: enteredPostalCodeIsValid,
      city: enteredCityIsValid,
      email: enteredEmailIsValid
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredPostalCodeIsValid &&
      enteredCityIsValid &&
      enteredEmailIsValid;

    if (!formIsValid) {
      return;
    }

    onConfirm({
      name: enteredName,
      street: enteredStreet,
      'postal-code': enteredPostalCode,
      city: enteredCity,
      email: enteredEmail
    });
  }

  return (
    <form className="checkout-form" onSubmit={confirmHandler}>
      <h2>Checkout</h2>
      <div className={`control ${!formInputsValidity.name ? 'invalid' : ''}`}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={`control ${!formInputsValidity.email ? 'invalid' : ''}`}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailInputRef} />
        {!formInputsValidity.email && <p>Please enter a valid email!</p>}
      </div>
      <div className={`control ${!formInputsValidity.street ? 'invalid' : ''}`}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetInputRef} />
        {!formInputsValidity.street && <p>Please enter a valid street!</p>}
      </div>
      <div className="control-row">
        <div className={`control ${!formInputsValidity.postalCode ? 'invalid' : ''}`}>
          <label htmlFor="postal">Postal Code</label>
          <input type="text" id="postal" ref={postalCodeInputRef} />
          {!formInputsValidity.postalCode && (
            <p>Please enter a valid postal code (5 characters long)!</p>
          )}
        </div>
        <div className={`control ${!formInputsValidity.city ? 'invalid' : ''}`}>
          <label htmlFor="city">City</label>
          <input type="text" id="city" ref={cityInputRef} />
          {!formInputsValidity.city && <p>Please enter a valid city!</p>}
        </div>
      </div>
      <div className="modal-actions">
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button">Confirm Order</button>
      </div>
    </form>
  );
} 