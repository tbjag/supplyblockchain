pragma solidity ^0.8.0;

import "./Roles.sol";

contract Insurer {
    using Roles for Roles.Role;
    uint counter;
    
    constructor () {
        counter = 4;
        _addIN(msg.sender, counter++);  
    }

    Roles.Role private insurers;

    event INAdded(address indexed account);
    event INRemoved(address indexed account);

    function addMeAsIN() public {
        _addIN(msg.sender, counter++);
    }

    function _addIN(address account, uint accNum) internal {
        insurers.add(account, accNum);
        emit INAdded(account);
    }

    function _removeIN(address account) internal {
        insurers.remove(account);
        emit INRemoved(account);
    }

    modifier onlyIN(){
        require(isIN(msg.sender), "Not a valid Insurer");
        _;
    }

    function isIN(address account) public view returns (bool) {
        return insurers.has(account);
    }

    function getINaddr(uint accNumber) public view returns (address) {
        return insurers.returnAddress(accNumber);
    }
}