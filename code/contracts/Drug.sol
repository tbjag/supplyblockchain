pragma solidity ^0.8.0;

contract Drug {
    mapping (uint => DrugItem) dItems;
    
    uint drugCount;

    struct DrugItem {
        uint id;
        uint quantity;
        uint price;
        address payable currentOwner;
        address manufacturer;
        address wholesale;
        address pharmacy;
        uint manufactDate;
        bool isSoldOut;
    }
    
    event DrugAdded(uint drugCount, uint dID, address currentOwner);

    ///Drug(id, _name, _quantity, _price, msg.sender, false);
    constructor () public { 
        drugCount = 0;
    }

    function addDrug(uint q, uint price) public {
        DrugItem memory newDrug;
        newDrug.id = drugCount++;
        newDrug.quanttity = q;
        newDrug.price = price;
        newDrug.currentOwner = msg.sender;
        newDrug.isSoldOut = false;
        dItems[drugCount] = newDrug;
    }

    function setManufacturer(uint dID)


    function getPrice() view public returns (uint) { return price;}
    function getID() view public returns (uint) { return id;}
    function getQuant() view public returns (uint) { return quantity;}
    function getPrice() view public returns (uint) { return price;}
    function getSupplier() view public returns (address) { return supplier;}
    function getSoldout() view public returns (bool) { return isSoldOut;}
}