pragma solidity ^0.8.0;

import "./Drug.sol";

contract DiscountContract {
    uint discountCode;
    address insurer;
    address manufact;
    uint drugID;
    /*Solidity doesn't have floating points var type,
    so discountPrice will be a negative value.
    discounted price of each pill = drug.price + discountPrice 
    e.g. 
    */
    int discountPrice;
    uint dateFinalized;

}