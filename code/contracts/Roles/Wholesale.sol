pragma solidity ^0.8.0;

import "./Roles.sol";

contract Wholesale {
    using Roles for Roles.Role;

    uint counter;

    constructor () {
        counter = 6;
        _addWD(msg.sender, counter++);  
    }

    Roles.Role private wholesales;

    event WDAdded(address indexed account, uint accNum);
    event WDRemoved(address indexed account);

    function addMeAsWD() public {
        _addWD(msg.sender, counter++);
        emit WDAdded(msg.sender, counter);
    }

    function _addWD(address account, uint accNum) internal {
        wholesales.add(account, accNum);
        emit WDAdded(account, accNum);
    }

    function _removeWD(address account) internal {
        wholesales.remove(account);
        emit WDRemoved(account);
    }

    modifier onlyWD(){
        require(isWD(msg.sender), "Not a valid WD");
        _;
    }

    function isWD(address account) public view returns (bool) {
        return wholesales.has(account);
    }

    function getWDaddr(uint accNumber) public view returns (address) {
        return wholesales.returnAddress(accNumber);
    }
}