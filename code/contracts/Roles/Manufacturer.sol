pragma solidity ^0.8.0;

import "./Roles.sol";

contract Manufacturer {
    using Roles for Roles.Role;

    constructor () {
        _addMA(msg.sender);  
    }

    Roles.Role private Manufacturers;

    event MAAdded(address indexed account);
    event MARemoved(address indexed account);

    function _addMA(address account) internal {
        Manufacturers.add(account);
        emit MAAdded(account);
    }

    function _removeMA(address account) internal {
        Manufacturers.remove(account);
        emit MARemoved(account);
    }

    modifier onlyMA(){
        require(isMA(msg.sender));
        _;
    }

    function isMA(address account) public view returns (bool) {
        return Manufacturers.has(account);
    }


}