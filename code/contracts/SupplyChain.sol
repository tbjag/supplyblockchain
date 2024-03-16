pragma solidity ^0.8.0;

import "./Roles/Insurer.sol";
import "./Roles/Manufacturer.sol";
import "./Roles/Pharmacy.sol";
import "./Roles/Wholesale.sol";

// between PH & WD, WD & MA 
contract SupplyChain is Pharmacy, Manufacturer, Wholesale, Insurer {

    address owner;

    // Drug ID => Drug amount
    mapping (uint => Drug) public drugs;

    mapping (address => mapping(uint => DrugRequest)) public pharmacyRequests;
    mapping (address => mapping(uint => DrugRequest)) public wholesaleRequests;

    mapping (uint => Discount) public discountCodes;



    // entity => (drug ID => drug info)
    mapping(address => mapping(uint => Drug)) public pharmacyInventory;
    mapping(address => mapping(uint => Drug)) public wholesaleInventory;
    mapping(address => mapping(uint => Drug)) public manufacturerInventory;

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

    // account # to addresses
    mapping (uint => address) Wholesales;
    mapping (uint => address) Pharmacies;
    mapping (uint => address) Manufacturers;
    mapping (uint => address) Insurers;

    
    event DrugAdded(uint id, string name, uint quantity, uint price);
    
    event DrugAddedPH(uint drugID, uint quantity, address phAddr);
    event DrugAddedWD(uint drugID, uint quantity, address wdAddr);
    event DiscountCodeAddedPH(uint discountCode, uint drugID, address ph);

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
    function addDrug(uint dID, string memory name, uint price) public {
        drugs[drugCount++] = Drug(dID, name, price, 0, address(0), address(0), address(0), address(0), false);
        emit DrugAdded(dID, name, 0, price);
    }

    function addDrugInPH(uint dID, uint quant) public onlyPH() {
        pharmacyInventory[msg.sender][dID] = Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), address(0), msg.sender, false);
        emit DrugAddedPH(dID, quant, msg.sender);
    }

    function addDrugInWD(uint dID, uint quant) public onlyWD() {
        wholesaleInventory[msg.sender][dID] = Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), msg.sender, address(0), false);
        emit DrugAddedWD(dID, quant, msg.sender);
    }

    function addDiscountInPH(uint dcCode, uint discountprice, uint drugID, uint INaccNum) public onlyPH() {
        address ins = Insurers[INaccNum];
        discountCodes[dcCode] = Discount(dcCode, ins, drugID, discountprice, block.timestamp);
        emit DiscountCodeAddedPH(dcCode, drugID, msg.sender);
    }

    function sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)  public payable 
        onlyPH()   {
        uint totalPrice = (drugs[drugID].price - discountCodes[dcCode].discountPrice) * quant;
        address payable toWDaddr = payable(Wholesales[WDaccNum]);
        require(totalPrice <= msg.value, "Insufficient fund.");
        uint reqID = drugID + quant + dcCode + WDaccNum;
        pharmacyRequests[msg.sender][reqID] = DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false);
        wholesaleRequests[toWDaddr][reqID] = DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false);
        toWDaddr.transfer(totalPrice);
        emit SendRequestByPH(drugID, quant, totalPrice, toWDaddr);
    }

    function shipDrugWD(uint drugID, uint quant, uint PHaccNum) public onlyWD() {
        require(wholesaleInventory[msg.sender][drugID].quantity >= quant, "Not enough drug quantity in the inventory.");
        address toPHaddr = Pharmacies[PHaccNum];
        wholesaleInventory[msg.sender][drugID].quantity -= quant;
        pharmacyInventory[toPHaddr][drugID].quantity += quant;
        if(wholesaleInventory[msg.sender][drugID].quantity == 0) wholesaleInventory[msg.sender][drugID].isSoldOut = true;
        emit ShipDrugByWD(drugID, quant, PHaccNum);
    }

    function confirmDrugShipment(uint reqID, uint quant, uint WDaccNum) public onlyPH() {
        address toWDaddr = Wholesales[WDaccNum];
        pharmacyRequests[msg.sender][reqID].confirmed = true;
        wholesaleRequests[toWDaddr][reqID].confirmed = true;
        emit ReqConfirmedByPH(reqID, msg.sender, toWDaddr);
    }

    function addDrugRequestWD(uint drugID, uint quant, uint WDaccNum, uint dcCode) public {

    }


}