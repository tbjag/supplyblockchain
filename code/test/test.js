const { expect } = require("chai");

describe("Test Supply Chain contract", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        // Create the smart contract object to test from
        [owner, PH_addr, WD_addr, IN_addr] = await ethers.getSigners();
        const TestContract = await ethers.getContractFactory("SupplyChain");
        contract = await TestContract.deploy();
    });

    it("Adding Pharmacy Role to account", async function () {
        // Get output from functions
        await contract.connect(PH_addr).addMeAsPH();
        expect(await contract.isPH(PH_addr)).to.equal(true);
    });

    it("Adding Wholesale Role to account", async function () {
        // Get output from functions
        await contract.connect(WD_addr).addMeAsWD();
        expect(await contract.isWD(WD_addr)).to.equal(true);
    });

    it("Adding Insurance Role to account", async function () {
        // Get output from functions
        await contract.connect(IN_addr).addMeAsIN();
        expect(await contract.isIN(IN_addr)).to.equal(true);
    });

    it("Owner: Add Drug should emit DrugAdded event", async function () {
        // Add Drug
        await expect(contract.connect(owner).addDrug('DrugA', 10))
        .to.emit(contract, "DrugAdded")
        .withArgs(0, 'DrugA', 0, 1);
    });

    it("PH: Add Drug should emit DrugAddedPH event", async function () {
        // Add Drug in PH
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(PH_addr).addMeAsPH();
        await expect(contract.connect(PH_addr).addDrugInPH(0, 10))
        .to.emit(contract, "DrugAddedPH")
        .withArgs(0, 10, PH_addr);
    });

    it("Non-PH: Add Drug should fail", async function () {
        // Add Drug in PH (not permitted)
        await contract.connect(owner).addDrug('DrugA', 10);
        await expect(contract.connect(owner_addr).addDrugInPH(0, 10))
        .to.be.revertedWith("Not a valid Pharmacy");
    });

    it("WD: Add Drug should emit DrugAddedWD event", async function () {
        // Add Drug in WD
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(WD_addr).addMeAsWD();
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);
    });

    it("Non-WD: Add Drug should fail", async function () {
        // Add Drug in WD (not permitted)
        await contract.connect(owner).addDrug('DrugA', 10);
        await expect(contract.connect(owner_addr).addDrugInWD(0, 10))
        .to.be.revertedWith("Not a valid WD");
    });

    it("IN: Add Discount code should emit DrugAddedWD event", async function () {
        // Add Discount code
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(IN_addr).addMeAsIN();
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 4))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);
    });

    it("Non-IN: Add Discount code should fail", async function () {
        // Add Discount code
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(IN_addr).addMeAsIN();
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 4))
        .to.be.revertedWith("Not a valid Insurer");
    });

    it("Supply chain: PH request shipment, WD ships drug, PH confirms shipment", async function () {
        // Add Drug
        await contract.connect(owner).addDrug('DrugA', 10)

        // Add Discount code
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(IN_addr).addMeAsIN();
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 4))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // PH Requests Drug Shipment
        await contract.connect(PH_addr).addMeAsPH();
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, WD_addr, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 10, 50, WD_addr);

        // Ship Drug from WD
        await contract.connect(WD_addr).addMeAsWD();
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);
        await expect(contract.connect(WD_addr).shipDrugWD(0, 10, 0))
        .to.emit(contract, "ShipDrugByWD")
        .withArgs(0, 10, 0);

        // PH confirms Drug Shipment
        await expect(contract.connect(PH_addr).confirmDrugShipment(15, 10, 4))
        .to.emit(contract, "ReqConfirmedByPH")
        .withArgs(15, PH_addr, WD_addr);
    });

    it("PH: Insufficient funds from Pharmacy to request shipment", async function () {
        // Add Drug
        await contract.connect(owner).addDrug('DrugA', 1);

        // Add Discount code
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(IN_addr).addMeAsIN();
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 4))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment from PH
        await contract.connect(PH_addr).addMeAsPH();
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, WD_addr, 1))
        .to.be.revertedWith("Insufficient fund.");
    });

    it("WD: Insufficient drugs in WD to ship drugs", async function () {
        // Add Drug
        await contract.connect(owner).addDrug('DrugA', 10)

        // Add Discount code
        await contract.connect(owner).addDrug('DrugA', 10);
        await contract.connect(IN_addr).addMeAsIN();
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 4))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment
        await contract.connect(PH_addr).addMeAsPH();
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, WD_addr, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 10, 50, WD_addr);

        // Ship Drug from WD
        await contract.connect(WD_addr).addMeAsWD();
        await expect(contract.connect(WD_addr).addDrugInWD(0, 1))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 1, WD_addr);
        await expect(contract.connect(owner_addr).shipDrugInWD(0, 10, 0))
        .to.be.revertedWith("Not enough drug quantity in the inventory.");
    });
});