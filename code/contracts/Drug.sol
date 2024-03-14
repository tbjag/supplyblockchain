pragma solidity ^0.8.0;

contract Drug {
    uint id;
    string name;
    uint quantity;
    uint price;
    address supplier;
    bool isSoldOut;

    ///Drug(id, _name, _quantity, _price, msg.sender, false);
    constructor(uint dID, string memory dName, uint q, uint p, address sup, bool sold) {
        id = dID;
        name = dName;
        quantity = q;
        price = p;
        supplier = sup;
        isSoldOut = sold;
    }

    function getPrice() view public returns (uint) { return price;}
    function getID() view public returns (uint) { return id;}
}