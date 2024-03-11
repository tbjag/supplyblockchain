pragma solidity ^0.8.0;

contract Drug {
    uint public id;
    string public name;
    uint public quantity;
    uint public price;
    address public supplier;
    bool public isSoldOut;
}