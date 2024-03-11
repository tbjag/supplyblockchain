pragma solidity ^0.8.0;

import "./Drug.sol";

// between PH & WD, WD & MA 
contract DrugRequest {
    uint id;
    address sender;
    address receiver;

    Drug drug;
    uint quant;
    uint totalPrice;
    uint discountCode;

    // shipDate = now; return uint type timestamp of the current time
    uint shipDate;
    uint reqDate;
}