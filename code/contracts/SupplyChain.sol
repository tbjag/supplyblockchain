pragma solidity ^0.8.0;

import "./Roles/Insurer.sol";
import "./Roles/Manufacturer.sol";
import "./Roles/Pharmacy.sol";
import "./Roles/Wholesale.sol";

import "hardhat/console.sol";

// between PH & WD, WD & MA 
contract SupplyChain is Pharmacy, Manufacturer, Wholesale, Insurer {

    address owner;

    // Drug ID => Drug amount
    mapping (uint => Drug) drugs;

    mapping (address => mapping(uint => DrugRequest)) pharmacyRequests;
    mapping (address => mapping(uint => DrugRequest)) wholesaleRequests;

    mapping (uint => Discount) discountCodes;

    // entity => (Drug array) so that we can retrieve each inventory 
    mapping(address => Drug[]) pharmacyInventory;
    mapping(address => Drug[]) wholesaleInventory;
    mapping(address => mapping(uint => Drug)) manufacturerInventory;

    // account # to addresses

    // add this account address to Pharmacies when addPH is executed 
    // 
    uint drugCount;
    uint drugRequestCount;
    uint dcCount;

    struct Drug {
        uint id;
        string name;
        uint price;
        uint quantity;
        address currentOwner;
        address manufacturer;
        address wholesale;
        address pharmacy;
        bool isSoldOut;
    }

    struct DrugRequest {
        uint requestID;
        uint drugID;
        uint quant;
        uint totalPrice;
        address sender; //can be PH or WD
        address receiver; //can be WD or MA
        bool confirmed;
    }

    struct Discount{
        uint discountCode;
        address insurer;
        uint drugID;
        uint discountPrice;
        uint dateFinalized;
    }   
    
    event DrugAdded(uint id, string name, uint quantity, uint price);
    
    event DrugAddedPH(uint drugID, uint quantity, address phAddr);
    event DrugAddedWD(uint drugID, uint quantity, address wdAddr);
    event DiscountCodeAddedIN(uint discountCode, uint drugID, address ins);

    event SendRequestByPH(uint drugID, uint q, uint totalPrice, address toWD);
    event ShipDrugByWD(uint drugID, uint quant, uint PHaccNum);
    event ReqConfirmedByPH(uint reqID, address phar, address wd);

    constructor() {
        owner = msg.sender;
        drugCount = 0;
        drugRequestCount = 0;
        dcCount = 0;
    }
    
    //Adding drug information about drug id, name, and price
    function addDrug(string memory name, uint price) public {
        uint dID = drugCount;
        drugs[drugCount++] = Drug(dID, name, price, 0, address(0), address(0), address(0), address(0), false);
        emit DrugAdded(dID, name, 0, price);
    }

    function addDrugInPH(uint dID, uint quant) public onlyPH() {
        uint find = findDrugInPH(dID);
        if(find == pharmacyInventory[msg.sender].length) {
            pharmacyInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), address(0), msg.sender, false));
        }
        else pharmacyInventory[msg.sender][find].quantity += quant;
        emit DrugAddedPH(dID, quant, msg.sender);
    }

    function addDrugInWD(uint dID, uint quant) public onlyWD() {
        uint find = findDrugInWD(dID);
        if(find == wholesaleInventory[msg.sender].length) {
            wholesaleInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), address(0), msg.sender, false));
        }
        else wholesaleInventory[msg.sender][find].quantity += quant;
        emit DrugAddedWD(dID, quant, msg.sender);
    }

    function addDiscountInIN(uint dcCode, uint discountprice, uint drugID, uint INaccNum) public onlyIN() {
        address ins = super.getINaddr(INaccNum);
        discountCodes[dcCode] = Discount(dcCode, ins, drugID, discountprice, block.timestamp);
        emit DiscountCodeAddedIN(dcCode, drugID, msg.sender);
    }

    function sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)  public payable 
        onlyPH()   {
        uint totalPrice = (drugs[drugID].price - discountCodes[dcCode].discountPrice) * quant;
        address payable toWDaddr = payable(super.getWDaddr(WDaccNum));
        require(totalPrice <= msg.value, "Insufficient fund.");
        uint reqID = drugID + quant + dcCode + WDaccNum;
        pharmacyRequests[msg.sender][reqID] = DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false);
        wholesaleRequests[toWDaddr][reqID] = DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false);
        toWDaddr.transfer(totalPrice);
        emit SendRequestByPH(drugID, quant, totalPrice, toWDaddr);
    }

    function shipDrugWD(uint drugID, uint quant, uint PHaccNum) public onlyWD() {
        require(wholesaleInventory[msg.sender][drugID].quantity >= quant, "Not enough drug quantity in the inventory.");
        address toPHaddr = super.getPHaddr(PHaccNum);
        wholesaleInventory[msg.sender][drugID].quantity -= quant;
        pharmacyInventory[toPHaddr][drugID].quantity += quant;
        if(wholesaleInventory[msg.sender][drugID].quantity == 0) wholesaleInventory[msg.sender][drugID].isSoldOut = true;
        emit ShipDrugByWD(drugID, quant, PHaccNum);
    }

    function confirmDrugShipment(uint reqID, uint quant, uint WDaccNum) public onlyPH() {
        address toWDaddr = super.getWDaddr(WDaccNum);
        pharmacyRequests[msg.sender][reqID].confirmed = true;
        wholesaleRequests[toWDaddr][reqID].confirmed = true;
        emit ReqConfirmedByPH(reqID, msg.sender, toWDaddr);
    }

    function addDrugRequestWD(uint drugID, uint quant, uint WDaccNum, uint dcCode) public {

    }

    function findDrugInPH(uint dID) public view onlyPH() returns (uint) {
        uint len = pharmacyInventory[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (pharmacyInventory[msg.sender][i].id == dID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findDrugInWD(uint dID) public view onlyWD() returns (uint) {
        uint len = wholesaleInventory[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (wholesaleInventory[msg.sender][i].id == dID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function retrieveInventoryPH() public view onlyPH() {
        uint i = 0;
        Drug[] memory thisInventory = pharmacyInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
        }
    }

    function retrieveInventoryWD() public view onlyPH() {
        uint i = 0;
        Drug[] memory thisInventory = wholesaleInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
        }
    }

}