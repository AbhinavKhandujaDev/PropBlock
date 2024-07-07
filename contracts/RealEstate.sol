//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import {ERC721} from  "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./lib/Counter.sol";

contract RealEstate is ERC721URIStorage {
    using Counter for CounterModel;
    CounterModel private tokenIds;

    constructor() ERC721("Real Estate", "REAL") {}

    function mint(string memory tokenUri) public payable returns(uint256){
        tokenIds.increment();

        uint256 newItemId = tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenUri);

        return newItemId;
    }

    function totalSupply() public view returns(uint256){
        return tokenIds.current();
    }
}
