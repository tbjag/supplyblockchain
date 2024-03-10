pragma solidity ^0.8.0;

contract DrugSupplyChain {
    address public owner;
    uint public balance = 1000;    

    struct Drug {
        uint id;
        string name;
        uint quantity;
        uint price;
        address supplier;
        bool isSold;
    }

    mapping(uint => Drug) public drugs;
    uint public drugCount;

    event DrugAdded(uint id, string name, uint quantity, uint price, address supplier);
    event DrugPurchased(uint id, string name, uint quantity, uint price, address buyer);

constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }


function addDrug(string memory _name, uint _quantity, uint _price) public onlyOwner {
        drugCount++;
        drugs[drugCount] = Drug(drugCount, _name, _quantity, _price, msg.sender, false);
        emit DrugAdded(drugCount, _name, _quantity, _price, msg.sender);
    }

    function purchaseDrug(uint _id) public payable {
        Drug storage _drug = drugs[_id];

        require(_drug.id > 0 && _drug.id <= drugCount, "Invalid drug ID");
        require(!_drug.isSold, "Drug is already sold out");
        require(msg.value >= _drug.price, "Insufficient funds");

        _drug.isSold = true;
        _drug.quantity--;

        payable(_drug.supplier).transfer(msg.value);

        emit DrugPurchased(_drug.id, _drug.name, 1, _drug.price, msg.sender);
    }

	function getBalance() external view returns (uint256) {
		return address(this).balance;
	}
}

