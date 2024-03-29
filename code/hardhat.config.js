require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");     

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
paths: {
    artifacts: "./src/artifacts",
  },
        networks: {
                localhost: {
                        url: "http://ec2-13-57-28-239.us-west-1.compute.amazonaws.com:8545"
                        ,           chainID: 1337

                }
,
                hardhat: {
                        chainID: 1337
           }
   },
	namedAccounts: { 
		deployer: {
			default: 0,
			amount: "10000000000000000000000"
		},
	},

	solidity: "0.8.24",
};
