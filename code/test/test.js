const { expect } = require("chai");

describe("Test Supply Chain contract", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        // Create the smart contract object to test from
        [owner, PH_addr, MA_addr] = await ethers.getSigners();
        const TestContract = await ethers.getContractFactory("SupplyChain");
        contract = await TestContract.deploy();
    });

    it("Adding Pharmacy Role to account", async function () {
        // Get output from functions
        await contract.connect(PH_addr).addMeAsPH();
        expect(await contract.isPH(PH_addr)).to.equal(true);
    });

    it("Adding Manufacturer Role to account", async function () {
        // Get output from functions
        await contract.connect(MA_addr).addMeAsMA();
        expect(await contract.isMA(MA_addr)).to.equal(true);
    });
});