import React, { useState } from 'react';
import config from '../config/config.json'

const Wholesale = () => {
  // Fake incoming requests of drugs
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 1, drug: 'Drug A', amount: 50 },
    { id: 2, drug: 'Drug B', amount: 30 },
    { id: 3, drug: 'Drug C', amount: 20 }
  ]);

  // Fake list of bulk orders to the manufacturer
  const [bulkOrders, setBulkOrders] = useState([]);

  // Fake inventory of drugs
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Drug A', quantity: 200 },
    { id: 2, name: 'Drug B', quantity: 150 },
    { id: 3, name: 'Drug C', quantity: 100 }
  ]);

  // Function to handle shipment confirmation
  const handleConfirmShipment = (id, amount) => {
    // Logic to confirm shipment, here we will remove the request from the list
    setIncomingRequests(incomingRequests.filter(request => request.id !== id));
    // Update inventory by subtracting the shipped quantity
    setInventory(prevInventory => {
      return prevInventory.map(drug => {
        if (drug.id === id) {
          return { ...drug, quantity: drug.quantity - amount };
        }
        return drug;
      });
    });
  };

  // Function to handle bulk order submission
  const handleBulkOrderSubmit = () => {
    // Logic to submit bulk order, can include API calls or other actions
    console.log("Bulk Order Submitted:", bulkOrders);
    // Clear the bulk order list after submission
    setBulkOrders([]);
  };

  // Function to handle adding bulk order
  const handleAddBulkOrder = (drug, amount) => {
    setBulkOrders([...bulkOrders, { drug, amount }]);
  };

  return (
    <div>
      <h2>Wholesale | User Id: {config.id}</h2>

      <div>
        <h3>Incoming Requests</h3>
        <ul>
          {incomingRequests.map(request => (
            <li key={request.id}>
              {request.amount} units of {request.drug} - 
              <button onClick={() => handleConfirmShipment(request.id, request.amount)}>Confirm Shipment</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Current Inventory</h3>
        <ul>
          {inventory.map(drug => (
            <li key={drug.id}>
              {drug.name} - Quantity: {drug.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Bulk Order</h3>
        <p>Bulk Order Preview:</p>
        <ul>
          {bulkOrders.map((order, index) => (
            <li key={index}>{order.amount} units of {order.drug}</li>
          ))}
        </ul>
        <p>Add drugs to bulk order:</p>
        <button onClick={() => handleAddBulkOrder('Drug A', 100)}>Add Drug A</button>
        <button onClick={() => handleAddBulkOrder('Drug B', 200)}>Add Drug B</button>
        <button onClick={() => handleAddBulkOrder('Drug C', 150)}>Add Drug C</button>
        <button onClick={handleBulkOrderSubmit}>Submit Bulk Order</button>
      </div>
    </div>
  );
};

export default Wholesale;
