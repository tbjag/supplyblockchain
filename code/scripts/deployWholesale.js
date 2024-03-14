

const hre = require("hardhat")

async function main() {
    const Wholesale  = await hre.ethers.getContractFactory("Wholesale");
    // deploy contracts
    const wholesale  = await Wholesale.deploy();
    await wholesale.waitForDeployment();
    console.log("Wholesale contract deployed to: ", await wholesale.getAddress());
    const wholesaleAddress  = await wholesale.getAddress();
    saveFrontendFiles(wholesaleAddress  , "Wholesale");
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
