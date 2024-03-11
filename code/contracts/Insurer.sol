pragma solidity ^0.8.0;

import "./Drug.sol";
import "./DiscountContract.sol";

contract Insurer {
    address public owner;
    string name;
    // its discount code -> object
    mapping (uint => DiscountContract) discountContracts;

    function sendContract() private {}

    function finalizeContract() private {}
}