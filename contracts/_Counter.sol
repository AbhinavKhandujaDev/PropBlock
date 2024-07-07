//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

contract Counter {
    uint256 private count;

    function increment() public {
        count++;
    }
    
    function decrement() public  {
        count--;
    }
    
    function current() public view returns(uint256) {
        return count;
    }
}