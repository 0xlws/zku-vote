//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@appliedzkp/semaphore-contracts/interfaces/IVerifier.sol";
import "@appliedzkp/semaphore-contracts/base/SemaphoreCore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoterDemo is SemaphoreCore, Ownable {
    uint256[2] public votersRoot;
    IVerifier public verifier;
    mapping(uint256 => bool) internal commitments;
    mapping(uint256 => bool) internal nullifiers;
    mapping(uint256 => mapping(bytes32 => uint256)) private rating;
    bytes32[] private users;
    bytes32[] private proposals;
    bytes32[3][] private leaves;
    event Leaves(bytes32[3][]);

    constructor(bytes32[] memory _users, bytes32[] memory _proposals, address _verifier) {
        users = _users;
        for (uint256 i; i < users.length; i++){
            rating[0][users[i]] = 0;
        }

        proposals = _proposals;
        for (uint256 i; i < proposals.length; i++){
            rating[1][proposals[i]] = 0;
        }

        verifier = IVerifier(_verifier);
    }

    function getLeavesLength() public view returns (uint256){
        return leaves.length;
    }

    function getLeaves() public view returns (bytes32[3][] memory){
        return leaves;
    }

    function emptyLeaves() public onlyOwner {
        leaves = new bytes32[3][](0);
    }

    function addLeaf(bytes32[3] memory _leaf) public {
        leaves.push(_leaf);
        emit Leaves(leaves);
    }

    function _saveNullifier(uint256 _nullifier) internal {
        require(!nullifiers[_nullifier], "Already added");
        nullifiers[_nullifier] = true;
    }

    function _saveCommitment(uint256 _commitment) internal {
        require(!commitments[_commitment], "Already added");
        commitments[_commitment] = true;
    }

    function getRatingByUser(uint256 _group, bytes32 _user) public view returns(uint256){
        return rating[_group][_user];
    }

    function getRatingbyId(uint256 _group, uint256 _i) public view returns(uint256){
        return rating[_group][users[_i]];
    }

    function getUsersArr() public view returns(bytes32[] memory){
        return users;
    }

    function getUsersArrLength() public view returns(uint256){
        return users.length;
    }

    function getRatingAllExpensive(uint256 _group) public view returns(bytes32[] memory, uint256[] memory){
        uint256 count = users.length;
        bytes32[] memory arr1 = new bytes32[](count);
        uint256[] memory arr2 = new uint256[](count);
        for (uint256 i; i<count; i++){
            arr1[i] = users[i];
            arr2[i] = rating[_group][users[i]];
        }
        return (arr1, arr2);
    }

    function getProposalsAllExpensive(uint256 _group) public view returns(bytes32[] memory, uint256[] memory){
        uint256 count = proposals.length;
        bytes32[] memory arr1 = new bytes32[](count);
        uint256[] memory arr2 = new uint256[](count);
        for (uint256 i; i<count; i++){
            arr1[i] = proposals[i];
            arr2[i] = rating[_group][proposals[i]];
        }
        return (arr1, arr2);
    }

    function getRoot(uint256 _group) public view returns (uint256){
        return votersRoot[_group];
    }

    function setRoot(uint256 _group, uint256 _root) public onlyOwner{
        votersRoot[_group] = _root;
    }

    function setUserRating(uint256 _group, bytes32 _user) internal {
        rating[_group][_user] += 1; 
    }

    function vote(
        uint256 _group,
        uint256 _commitment,
        bytes32 _user,
        bytes32 _vote,
        uint256 _root,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external onlyOwner {
        require(!nullifiers[_nullifierHash], "You cannot vote twice");
        require(!commitments[_commitment], "You cannot vote for the same person twice");
        votersRoot[_group] = _root;
        _verifyProof(
            _vote, // bytes32 signal,
            votersRoot[_group], // uint256 root,
            _nullifierHash, // uint256 nullifierHash,
            votersRoot[_group], // uint256 externalNullifier,
            _proof, // uint256[8] calldata proof,
            verifier // IVerifier verifier
            );

        // Prevent double-vote (nullifierHash = hash(root + identityNullifier)).
        // Every user can vote once.
        if (_group == 0){
            _saveNullifier(_nullifierHash);
        }
        if (_group == 1){
            _saveCommitment(_commitment);
        }
        // Vote
        setUserRating(_group, _user);
    }
}
