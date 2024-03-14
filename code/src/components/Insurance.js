import React, { useState } from 'react';

const Insurance = () => {
  // State for contract form inputs
  const [contractForm, setContractForm] = useState({
    drug: '',
    discount: '',
    paidAmount: ''
  });

  // Fake list of received discount codes
  const [receivedDiscountCodes, setReceivedDiscountCodes] = useState([]);

  // Function to handle sending a contract to manufacture
  const handleSendContract = (e) => {
    e.preventDefault();
    // Logic to send contract, here you can implement your desired action
    console.log("Contract Sent:", contractForm);
    // Reset the form fields after sending the contract
    setContractForm({ drug: '', discount: '', paidAmount: '' });
  };

  // Function to handle sending discount codes to pharmacies
  const handleSendDiscountCodes = () => {
    // Logic to send discount codes to pharmacies, here you can implement your desired action
    console.log("Discount Codes Sent:", receivedDiscountCodes);
    // Clear the received discount codes after sending
    setReceivedDiscountCodes([]);
  };

  return (
    <div>
      <h2>Insurance</h2>
      <p>Welcome to the insurance page!</p>

      <div>
        <h3>Send Contract to Manufacture</h3>
        <form onSubmit={handleSendContract}>
          <label>
            Drug:
            <input
              type="text"
              value={contractForm.drug}
              onChange={e => setContractForm({ ...contractForm, drug: e.target.value })}
            />
          </label>
          <br />
          <label>
            Discount (%):
            <input
              type="number"
              value={contractForm.discount}
              onChange={e => setContractForm({ ...contractForm, discount: e.target.value })}
            />
          </label>
          <br />
          <label>
            Paid Amount:
            <input
              type="number"
              value={contractForm.paidAmount}
              onChange={e => setContractForm({ ...contractForm, paidAmount: e.target.value })}
            />
          </label>
          <br />
          <button type="submit">Send Contract</button>
        </form>
      </div>

      <div>
        <h3>Received Discount Codes</h3>
        <ul>
          {receivedDiscountCodes.map((code, index) => (
            <li key={index}>
              Drug: {code.drug} - Discount: {code.discount}%
            </li>
          ))}
        </ul>
        <button onClick={handleSendDiscountCodes}>Send Discount Codes to Pharmacies</button>
      </div>
    </div>
  );
};

export default Insurance;
