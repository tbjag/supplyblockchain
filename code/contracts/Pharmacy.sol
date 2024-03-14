pragma solidity ^0.8.0;

import "./Drug.sol";
import "./DrugRequest.sol";
import "./DiscountContract.sol";

contract Pharmacy {
    address public addr;
    string name;
    uint256 balance = addr.balance;
    // Drug ID => Drug amount
    mapping (uint => Drug) private drugs;
    mapping (string => address) private WDS;
    mapping (uint => DrugRequest) private requests;
    mapping (uint => DiscountContract) privatediscountCodes;
    // drugcount != drugid
    uint drugcount;
    uint drugReqCnt;

    constructor (string memory pname){
        name = pname;
        addr = msg.sender;
        drugcount = 0;
        drugReqCnt = 0;
    }

    function addDrug(uint Did, string memory dname, uint dquantity, uint dprice) private {
        drugs[drugcount] = new Drug(Did, dname, dquantity, dprice, msg.sender, false);
        drugcount++;
    }

    function requestDrug(string memory WD, uint dID, uint quantity, uint discountCode) private {
        Drug reqD = drugs[dID];
        address addrWD = WDS[WD];
        uint dcprice = privatediscountCodes[discountCode].getDiscountPrice();
        DrugRequest dr = new DrugRequest(addr, addrWD, reqD, quantity, discountCode, dcprice);
        dr.sendRequest();
        requests[drugReqCnt] = dr;
        drugReqCnt++;
    }

    function confirmShipment() private {

    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}