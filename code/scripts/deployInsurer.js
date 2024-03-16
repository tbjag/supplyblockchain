

const hre = require("hardhat")

async function main() {
    const Insurer  = await hre.ethers.getContractFactory("Insurer");
    // deploy contracts
    const insurer  = await Insurer.deploy();
    await insurer.waitForDeployment();
    console.log("Insurer contract deployed to: ", await insurer.getAddress());
    const insurerAddress  = await insurer.getAddress();
    saveFrontendFiles(insurerAddress  , "Insurer");
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
