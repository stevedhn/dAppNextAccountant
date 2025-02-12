// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bookkeeping {
    struct Transaction {
        uint256 id;
        uint256 amount;
        string description;
        uint256 timestamp;
        address from;
        address to;
    }

    Transaction[] public transactions;
    uint256 public nextId;

    event TransactionRecorded(
        uint256 indexed id,
        uint256 amount,
        string description,
        uint256 timestamp,
        address indexed from,
        address indexed to
    );

    function recordTransaction(uint256 amount, string memory description, address to) public {
        transactions.push(Transaction(nextId, amount, description, block.timestamp, msg.sender, to));
        emit TransactionRecorded(nextId, amount, description, block.timestamp, msg.sender, to);
        nextId++;
    }

    function getTransaction(uint256 id) public view returns (Transaction memory) {
        require(id < nextId, "Transaction does not exist");
        return transactions[id];
    }
}
