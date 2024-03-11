pragma solidity ^0.8.0;

import "./Drug.sol";
import "./DrugRequest.sol";

contract Manufacturer {
    address public owner;
    string name;
    // its id -> object
    mapping (uint => Drug) drugs;
    mapping (uint => DrugRequest) requests;
    uint drugcount;

    constructor (string memory pname){
        name = pname;
        owner = msg.sender;
        drugcount = 0;
    }

    function addDrug(uint id, string memory _name, uint _quantity, uint _price) private {
        drugCount++;
        drugs[drugCount] = Drug(id, _name, _quantity, _price, msg.sender, false);
        emit DrugAdded(id, _name, _quantity, _price, msg.sender);
    }

    //Receivers are always WD for these three functions
    // based on a drug request in requests
    function sendShipment() private {

    }
    
    function confirmRequest() private {

    }

    function confirmReceive() private {

    }

    // on a specific drug for a specific IN? - receiver: IN
    funtion sendDiscountCode() private {
    }


}