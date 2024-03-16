pragma solidity ^0.8.0;

import "./Roles.sol";

contract Wholesale {
    using Roles for Roles.Role;

    constructor () {
        _addWD(msg.sender);  
    }

    Roles.Role private Wholesales;

    event WDAdded(address indexed account);
    event WDRemoved(address indexed account);

    function _addWD(address account) internal {
        Wholesales.add(account);
        emit WDAdded(account);
    }

    function _removeWD(address account) internal {
        Wholesales.remove(account);
        emit WDRemoved(account);
    }

    modifier onlyWD(){
        require(isWD(msg.sender));
        _;
    }

    function isWD(address account) public view returns (bool) {
        return Wholesales.has(account);
    }

}