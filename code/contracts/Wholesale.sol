pragma solidity ^0.8.0;

import "./Drug.sol";
import "./DrugRequest.sol";
import "./DiscountContract.sol";

contract Wholesale {
    address public owner;
    string name;
    mapping (uint => Drug) drugs;
    mapping (uint => DrugRequest) drugRequests;
    mapping (uint => DiscountContract) discountCodes;
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

    // based on a drug request in requests
    function sendDrug() private {

    }

    function confirmRequest() private {

    }

    

}