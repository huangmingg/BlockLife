pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract BlockEcosystem {
    using SafeMath for uint256;

    address contractOwner;

    enum Identity { undefined, individual, institution }

    constructor() public {
        contractOwner = msg.sender;
    }

    mapping(address => bytes[]) individualProfile;
    mapping(address => bytes[]) organizationFeedback; 
    mapping(address => mapping(address => uint)) previousInteraction;

    mapping(address => Identity) userIdentity;

    event AddedInteraction(address);
    event AddedFeedBack(address);
    event RegisteredInstitution(address);

    modifier isContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner has access to this function!");
        _;
    }

    modifier isRegisteredInstitution () {
        require(userIdentity[msg.sender] == Identity.institution, "Only registered institutions have access to this function!");
        _;
    }

    modifier isUnregisteredUser() {
        require(userIdentity[msg.sender] == Identity.undefined, "Only unregistered uesrs have access to this function!");
        _;
    }

    function registerIndividual() public isUnregisteredUser() {
        userIdentity[msg.sender] = Identity.individual;
    }

    function registerInstitution(address newInstitution) public isContractOwner() {
        userIdentity[newInstitution] = Identity.institution;
    }

    function addInteraction(bytes memory interactionHash, address recipient) public isRegisteredInstitution() {
        individualProfile[recipient].push(interactionHash);
        emit AddedInteraction(recipient);
    }

    function getInteraction(address individual) public view returns (bytes[] memory) {
        return individualProfile[individual];
    }

    function addFeedback(bytes memory feedbackText, address institution) public {
        organizationFeedback[institution].push(feedbackText);
        emit AddedFeedBack(institution);
    }

    function getFeedback(address institution) public view returns (bytes[] memory) {
        return organizationFeedback[institution];
    }

}