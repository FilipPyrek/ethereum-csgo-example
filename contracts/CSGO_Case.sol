pragma solidity ^0.4.2;

contract CSGO_Case {

  struct Case {
    bytes32 id;
    uint collectionId;
  }

  uint lastId = 0;
  mapping (address => Case[]) inventories;

  function create(uint colllectionId){
    bytes32 caseId = sha3("case", block.number, colllectionId, ++lastId);
    inventories[msg.sender].push(Case({
      id: caseId,
      collectionId: colllectionId
    }));
  }

  function get(address owner, bytes32 caseId) returns (uint a){
    Case[] cases = inventories[owner];
    for (uint i = 0; i < cases.length; i++)
      if (cases[i].id == caseId) return cases[i].collectionId;
    throw;
  }

  function list(address owner, uint offset) returns (bytes32[64] ids, uint maxOffset) {
    Case[] cases = inventories[owner];
    maxOffset = cases.length;
    if (offset > maxOffset) return (ids, maxOffset);

    uint numberOfCases = maxOffset - offset;
    uint max = numberOfCases < 64 ? numberOfCases : 64;
    for (uint i = 0; i < max; i++)
      ids[i] = cases[offset + i].id;
    return (ids, maxOffset);
  }

}
