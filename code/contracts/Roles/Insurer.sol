pragma solidity ^0.8.0;

import "./Roles.sol";

contract Insurer {
    using Roles for Roles.Role;

    constructor () {
        _addIN(msg.sender);  
    }

    Roles.Role private Insurers;

    event INAdded(address indexed account);
    event INRemoved(address indexed account);

    function _addIN(address account) internal {
        Insurers.add(account);
        emit INAdded(account);
    }

    function _removeIN(address account) internal {
        Insurers.remove(account);
        emit INRemoved(account);
    }

    modifier onlyIN(){
        require(isIN(msg.sender));
        _;
    }

    function isIN(address account) public view returns (bool) {
        return Insurers.has(account);
    }


}