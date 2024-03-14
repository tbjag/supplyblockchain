import React, {Component} from 'react'
import Web3 from 'web3'
import HelloAbi from './contractsData/Hello.json'
import HelloAddress from './contractsData/Hello-address.json' // TODO change this

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Pharmacy from './components/Pharmacy';
import Manufacture from './components/Manufacture';
import Wholesale from './components/Wholesale';
import Insurance from './components/Insurance';
import NotFound from './components/NotFound';
import Home from './components/Home';

const App = () => (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pharmacy">Pharmacy</Link></li>
            <li><Link to="/manufacture">Manufacture</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
            <li><Link to="/insurance">Insurance</Link></li>
          </ul>
        </nav>
  
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/pharmacy' element={<Pharmacy/>} />
            <Route path='/manufacture' element={<Manufacture/>} />
            <Route path='/wholesale' element={<Wholesale/>} />
            <Route path='/insurance' element={<Insurance/>} />
            <Route element={<NotFound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
  

// class App extends Component {
//     componentWillMount(){
//         // this.loadBlockchainData()
//     }

// async loadBlockchainData(){
//     console.log('HelloAddress.address', HelloAddress.address)
//     console.log('HelloAbi.abi', HelloAbi.abi)
//     let NewHelloAbi = require('./contractsData/Hello.json');
//     const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-54-241-140-227.us-west-1.compute.amazonaws.com:8545"))
//     var account;
//     const accounts  = await web3.eth.getAccounts()
//     console.log(accounts)
//     web3.eth.getAccounts().then((f) => {
//         account = f[0];
//     })

//     this.setState( { account : accounts[0] })
//     console.log(account);
//     const contract = new web3.eth.Contract(NewHelloAbi.abi);
//     contract.options.address = HelloAddress.address
//     this.setState( { contract })

// }

//     constructor(props){
//         super(props)
//         console.log("constructor")
//         this.state = {
//             account: '',
//             loading: true,
//             message: ''
//         }
//      }

//     setHandler = (event) => {
//           event.preventDefault();
//           console.log('sending ' + event.target.setText.value + ' to the contract');
//           this.state.contract.methods.set(event.target.setText.value).send({ from: this.state.account });
//      }

//     getCurrentVal = async () => {
//           let val = await this.state.contract.methods.get().call(console.log);
//           console.log("val", val)
//           this.setState( { message : val })
//     }



// render(){

//         return (
//                 <div>
//                 <h5>message output: {this.state.message}</h5>
//                 <h4> {"Get/Set Contract interaction"} </h4>
//                         <form onSubmit={this.setHandler}>
//                                 <input id="setText" type="text"/>
//                                 <button type={"submit"}> Update Contract </button>
//                         </form>
//                         <div>
//                         <button onClick={this.getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
//                         </div>
//                 </div>
//         );
// }
// }

export default App;
