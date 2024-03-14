pragma solidity ^0.8.0;

import "./Drug.sol";

// between PH & WD, WD & MA 
contract DrugRequest {
    uint id;
    address payable public sender;
    address payable public receiver;

    Drug drug;
    uint quant;
    uint totalPrice;
    uint discountCode;
    uint public discountPrice;

    // shipDate = now; return uint type timestamp of the current time
    uint shipDate;
    uint reqDate;

    constructor (address s, address r, Drug d, uint q, uint dc, uint dcPrice){
        require(d.getPrice() > dcPrice, "Discount price is equal to or larger than the drug price.");
        sender = payable (s);
        receiver = payable (r);
        drug = d;
        quant = q;
        discountCode = dc;
        discountPrice = dcPrice;
        totalPrice = q * (d.getPrice() - dcPrice);
    }

    error OnlyPH();
    error OnlyWD();

    modifier onlyPH(){
        if (msg.sender != sender)
            revert OnlyPH();
        _;
    }

    modifier onlyWD(){
        if (msg.sender != receiver)
            revert OnlyWD();
        _;
    }

    event ReqSent();
    event DrugShipped();
    event Confirmed();

    function sendRequest() external onlyPH payable {
        require(msg.value == totalPrice, "Total price is not the same as value.");
        require(msg.sender.balance >= msg.value, "Insufficient fund.");
        (bool sent, bytes memory data) = receiver.call{value:msg.value}("");
        require(sent, "Failed to send Ether");
        emit ReqSent();
        // receiver.transfer(msg.value);
    }
}