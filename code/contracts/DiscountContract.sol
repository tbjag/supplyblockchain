pragma solidity ^0.8.0;

import "./Drug.sol";

contract DiscountContract {
    uint discountCode;
    address insurer;
    uint drugID;
    /*Solidity doesn't have floating points var type,
    discounted price of each pill = drug.price - discountPrice 
    e.g. 
    */
    uint discountPrice;
    uint dateFinalized;

    constructor (uint code, address ) {

    }

    function getDiscountCode() public view returns (uint) {return discountCode;}
    function getDiscountPrice() public view returns (uint) {return discountPrice;}
    function getDrugID() public view returns (uint) {return drugID;}
    function getInsurer() public view returns (address) {return insurer;}
}