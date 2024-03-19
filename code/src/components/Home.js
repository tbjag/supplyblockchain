import React from 'react';
import { useContractInitialization } from './Contract'; //change

const Home = () => (
  <div>
    <h2>Home</h2>
    <p>Welcome to the home page!</p>
  </div>
);

// function MyComponent() {
//   const { web3, accounts, contract } = useContractInitialization();

//   // Now you can use web3, accounts, and contract in your component
  
//   return (
//     <div>
//       {/* Your component JSX */}
//     </div>
//   );
// }

// export default MyComponent;

export default Home;
