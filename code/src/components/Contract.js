import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SupplyChainAbi from './contractsData/SupplyChain.json';
import SupplyChainAddress from './contractsData/SupplyChain-address.json';

// Custom hook for initializing Web3 and contract
export function useContractInitialization() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider("http://ec2-54-215-141-163.us-west-1.compute.amazonaws.com:8545"));
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(SupplyChainAbi, SupplyChainAddress);
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);
        await contractInstance.methods.showAllEntities();
      } catch (error) {
        console.error('Error initializing DApp:', error);
      }
    };

    init(); // Call the initialization function once when the component mounts

    // Since this effect is only intended to run once, you can pass an empty dependency array to useEffect
  }, []);

  return { web3, accounts, contract };
}