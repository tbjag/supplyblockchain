pragma solidity ^0.8.0;

import "./Roles.sol";

contract Manufacturer {
    using Roles for Roles.Role;

    constructor () {
        uint counter = 2;
        _addMA(msg.sender, counter++);  
    }

    Roles.Role private manufacturers;

    event MAAdded(address indexed account);
    event MARemoved(address indexed account);

    function _addMA(address account, uint accNum) internal {
        manufacturers.add(account, accNum);
        emit MAAdded(account);
    }

    function _removeMA(address account) internal {
        manufacturers.remove(account);
        emit MARemoved(account);
    }

    modifier onlyMA(){
        require(isMA(msg.sender));
        _;
    }

    function isMA(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    function getMAaddr(uint accNumber) public view returns (address) {
        return manufacturers.returnAddress(accNumber);
    }
}