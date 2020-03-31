pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract BlockEcosystem {
    using SafeMath for uint256;

    address contractOwner;

    enum Identity { undefined, individual, institution, owner }

    struct Interaction {
        bytes interactionHash;
        uint dateTime;
    }

    struct Feedback {
        bytes text;
        uint dateTime;
    }

    constructor() public {
        contractOwner = msg.sender;
        userIdentity[msg.sender] = Identity.owner;
    }

    mapping(address => Interaction[]) individualProfile;
    mapping(address => Feedback[]) organizationFeedback; 
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

    function addInteraction(bytes memory interactionHash, uint timestamp, address recipient) public isRegisteredInstitution() {
        Interaction memory newInteraction = Interaction(interactionHash, timestamp);
        individualProfile[recipient].push(newInteraction);
        emit AddedInteraction(recipient);
    }

    function getInteraction(address individual) public view returns (Interaction[] memory) {
        return individualProfile[individual];
    }

    function addFeedback(bytes memory feedbackText, uint timestamp, address institution) public {
        Feedback memory newFeedback = Feedback(feedbackText, timestamp);
        organizationFeedback[institution].push(newFeedback);
        emit AddedFeedBack(institution);
    }

    function getFeedback(address institution) public view returns (Feedback[] memory) {
        return organizationFeedback[institution];
    }

    function checkUserIdentity(address userAddress) public view returns (Identity) {
        return userIdentity[userAddress];
    }

}