pragma solidity ^0.8.0;

import "./Roles.sol";

contract Pharmacy {
    using Roles for Roles.Role;

    Roles.Role private pharmacies;

    event PHAdded(address indexed account);
    event PHRemoved(address indexed account);

    constructor ()  {
        _addPH(msg.sender);
    }

    function _addPH(address account) internal {
        pharmacies.add(account);
        emit PHAdded(account);
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


}