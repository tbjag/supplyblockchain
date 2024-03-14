import React, { useState } from 'react';
import config from '../config/config.json'

const Pharmacy = () => {
  // Fake inventory of drugs
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Drug A', price: 10, quantity: 100 },
    { id: 2, name: 'Drug B', price: 20, quantity: 50 },
    { id: 3, name: 'Drug C', price: 15, quantity: 75 }
  ]);

  // State for form inputs
  const [orderForm, setOrderForm] = useState({
    amount: 0,
    drug: '',
    price: 0,
    discountCode: ''
  });

  // Function to handle order form submission
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", orderForm);
  };

  return (
    <div>
      <h2>Pharmacy | User Id: {config.id}</h2>

      <h3>Inventory</h3>
      <ul>
        {inventory.map(drug => (
          <li key={drug.id}>
            {drug.name} - Price: ${drug.price} - Quantity: {drug.quantity}
          </li>
        ))}
      </ul>

      <h3>Order Form</h3>
      <form onSubmit={handleOrderSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={orderForm.amount}
            onChange={e => setOrderForm({ ...orderForm, amount: parseInt(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Drug:
          <select
            value={orderForm.drug}
            onChange={e => setOrderForm({ ...orderForm, drug: e.target.value })}
          >
            <option value="">Select Drug</option>
            {inventory.map(drug => (
              <option key={drug.id} value={drug.name}>
                {drug.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={orderForm.price}
            onChange={e => setOrderForm({ ...orderForm, price: parseInt(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Discount Code:
          <input
            type="text"
            value={orderForm.discountCode}
            onChange={e => setOrderForm({ ...orderForm, discountCode: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Order</button>
      </form>
    </div>
  );
};

export default Pharmacy;
