// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

struct CounterModel {
    uint256 value;
}

library Counter {
    function increment(CounterModel storage counter) internal {
        counter.value++;
    }
    
    function decrement(CounterModel storage counter) internal {
        counter.value--;
    }
    
    function current(CounterModel storage counter) internal view returns(uint256) {
        return counter.value;
    }
}