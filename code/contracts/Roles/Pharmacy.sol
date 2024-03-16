pragma solidity ^0.8.0;

import "./Roles.sol";

contract Pharmacy {
    using Roles for Roles.Role;

    Roles.Role private pharmacies;    
    uint counter;

    event PHAdded(address indexed account, uint accNum);
    event PHRemoved(address indexed account);

    constructor ()  {
        counter = 0;
        _addPH(msg.sender, counter++);
    }
    
    function addMeAsPH() public {
        _addPH(msg.sender, counter++);
    }

    function _addPH(address account, uint accNum) internal {
        pharmacies.add(account, accNum);

        emit PHAdded(account, accNum);
    }

    function _removePH(address account) internal {
        pharmacies.remove(account);
        emit PHRemoved(account);
    }

    modifier onlyPH(){
        require(isPH(msg.sender));
        _;
    }

    function isPH(address account) public view returns (bool) {
        return pharmacies.has(account);
    }

    function getPHaddr(uint accNumber) public view returns (address) {
        return pharmacies.returnAddress(accNumber);
    }

}