

const hre = require("hardhat")

async function main() {
    const Manufacturer  = await hre.ethers.getContractFactory("Manufacturer");
    // deploy contracts
    const manufacturer  = await Manufacturer.deploy();
    await manufacturer.waitForDeployment();
    console.log("Manufacturer contract deployed to: ", await manufacturer.getAddress());
    const manufacturerAddress  = await manufacturer.getAddress();
    saveFrontendFiles(manufacturerAddress  , "Manufacturer");
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
