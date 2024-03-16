

const hre = require("hardhat")

async function main() {
    const Pharmacy  = await hre.ethers.getContractFactory("Pharmacy");
    // deploy contracts
    const pharmacy  = await Pharmacy.deploy();
    await pharmacy.waitForDeployment();
    console.log("Pharmacy contract deployed to: ", await pharmacy.getAddress());
    const pharmacyAddress  = await pharmacy.getAddress();
    saveFrontendFiles(pharmacyAddress  , "Pharmacy");
}

function saveFrontendFiles(contractAddress, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
