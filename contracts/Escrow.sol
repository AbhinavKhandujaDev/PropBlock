//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public lender;
    address public inspector;

    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint256) public purchasePrice;
    mapping (uint256 => uint256) public escrowAmount;
    mapping (uint256 => address) public buyer;

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }
    
    modifier onlyBuyer(uint256 _nftId) {
        require(msg.sender == buyer[_nftId], "Only Buyer can call this method");
        _;
    }

    constructor(
        address _nftAddress,
        address payable _seller, 
        address _inspector, 
        address _lender
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        lender = _lender;
        inspector = _inspector;
    }

    function list(
        uint256 _nftId, 
        address _buyer, 
        uint256 _purchasePrice, 
        uint256 _escrowAmount
    ) onlySeller public {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
        isListed[_nftId] = true;
        purchasePrice[_nftId] = _purchasePrice;
        escrowAmount[_nftId] = _escrowAmount;
        buyer[_nftId] = _buyer;
    }

    function depositEarnest(uint256 _nftId) onlyBuyer(_nftId) payable public {
        require(msg.value == escrowAmount[_nftId], "value does not match the escrow amount");
    }
}
