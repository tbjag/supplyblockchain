const { expect } = require("chai");

describe("Test Supply Chain contract", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        // Create the smart contract object to test from
        [PH_addr, WD_addr, IN_addr, MA_addr] = await ethers.getSigners();
        const TestContract = await ethers.getContractFactory("SupplyChain");
        contract = await TestContract.deploy();
        contract.addPHaccounts();
    });

    it("Add Drug should emit DrugAdded event", async function () {
        // Add Drug
        await expect(contract.addDrug('DrugA', 10))
        .to.emit(contract, "DrugAdded")
        .withArgs(0, 'DrugA', 0, 10);
    });

    it("PH: Add Drug should emit DrugAddedPH event", async function () {
        // Add Drug in PH
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(PH_addr).addDrugInPH(0, 10))
        .to.emit(contract, "DrugAddedPH")
        .withArgs(0, 10, PH_addr);
    });

    it("Non-PH: Add Drug should fail", async function () {
        // Add Drug in PH (not permitted)
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(WD_addr).addDrugInPH(0, 10))
        .to.be.revertedWith("Not a Pharmacy!");
    });

    it("WD: Add Drug should emit DrugAddedWD event", async function () {
        // Add Drug in WD
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);
    });

    it("Non-WD: Add Drug should fail", async function () {
        // Add Drug in WD (not permitted)
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(MA_addr).addDrugInWD(0, 10))
        .to.be.revertedWith("Not a Wholesale Distributor!");
    });

    it("IN: Add Discount code should emit DrugAddedWD event", async function () {
        // Add Discount code
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);
    });

    it("Non-IN: Add Discount code should fail", async function () {
        // Add Discount code (not permitted)
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(PH_addr).addDiscountInIN(1, 5, 0, 2))
        .to.be.revertedWith("Not an Insurer!");
    });

    it("Supply chain: PH request shipment, WD ships drug, PH confirms shipment", async function () {
        // Add Discount code
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // PH Requests Drug Shipment
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 10, 50, WD_addr);

        // Ship Drug from WD
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10))  
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();

        await expect(contract.connect(WD_addr).shipDrugWD(0, 10, 0))
        .to.emit(contract, "ShipDrugByWD")
        .withArgs(0, 10, 0);

        // PH confirms Drug Shipment
        await expect(contract.connect(PH_addr).confirmDrugShipment(12, 10, 0))
        .to.emit(contract, "ReqConfirmedByPH")
        .withArgs(12, PH_addr, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();
    });

    it("PH: Insufficient funds from Pharmacy to request shipment", async function () {
        // Add Discount code
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment from PH
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 1))
        .to.be.revertedWith("Insufficient fund.");
    });

    it("WD: Insufficient drugs in WD to ship drugs", async function () {
        // Add Discount code
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 10, 50, WD_addr);

        // Ship Drug from WD
        await expect(contract.connect(WD_addr).addDrugInWD(0, 1))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 1, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();

        await expect(contract.connect(WD_addr).shipDrugInWD(0, 10, 0))
        .to.be.revertedWith("Not enough drug quantity in the inventory.");

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();
    });
});