import React, { useState } from 'react';
import config from '../config/config.json';

const Pharmacy = () => {
  // Updated inventory of drugs with different coverage plans
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: 'Drug A', 
      price: 10, 
      quantity: 100, 
      coveragePlans: [
        { plan: 'Plan A', discountRate: 0, discountCode: 'CODE_A' },
        { plan: 'Plan B', discountRate: 5, discountCode: 'CODE_B' },
        { plan: 'Plan C', discountRate: 10, discountCode: 'CODE_C' }
      ] 
    },
    { 
      id: 2, 
      name: 'Drug B', 
      price: 20, 
      quantity: 50, 
      coveragePlans: [
        { plan: 'Plan X', discountRate: 3, discountCode: 'CODE_X' },
        { plan: 'Plan Y', discountRate: 7, discountCode: 'CODE_Y' },
        { plan: 'Plan Z', discountRate: 12, discountCode: 'CODE_Z' }
      ] 
    },
    // Add more drugs as needed
  ]);

  // State for form inputs
  const [orderForm, setOrderForm] = useState({
    amount: 0,
    drug: '',
    price: 0,
    discountCode: '',
    wholesaleId: '' // New field for wholesale ID
  });

  // Wholesale ID list
  const wholesaleIds = ['wd1', 'wd2', 'wd3'];

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
            <ul>
              {drug.coveragePlans.map((plan, index) => (
                <li key={index}>
                  Coverage Plan: {plan.plan} - Discount: {plan.discountRate} - Discount Code: {plan.discountCode}
                </li>
              ))}
            </ul>
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
        <label>
          Wholesale ID:
          <select
            value={orderForm.wholesaleId}
            onChange={e => setOrderForm({ ...orderForm, wholesaleId: e.target.value })}
          >
            <option value="">Select Wholesale ID</option>
            {wholesaleIds.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Order</button>
      </form>
    </div>
  );
};

export default Pharmacy;
