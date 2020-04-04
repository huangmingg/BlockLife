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
        address issuer;
        bool isValid;
    }

    struct Feedback {
        uint id;
        bytes text;
        uint dateTime;
        address owner;
        bool isValid;
    }

    constructor() public {
        contractOwner = msg.sender;
        userIdentity[msg.sender] = Identity.owner;
        authorizedList[msg.sender] = true;
    }

    mapping(address => Identity) userIdentity;
    mapping(address => bool) authorizedList;
    mapping(address => Interaction[]) individualProfile;
    // maps to address to interaction hash to index
    mapping(address => mapping(bytes => uint)) private _indexOfInteractionList;
    mapping(address => Feedback[]) organizationFeedback; 
    // maps to address to feedback id to index
    mapping(address => mapping(uint => uint)) private _indexOfFeedbackList;    
    
    // mapping(address => mapping(address => uint)) previousInteraction;

    event AddedInteraction(address);
    event AddedFeedBack(address);
    event RegisteredInstitution(address);
    event InvalidateInteraction(bytes);
    event InvalidateFeedback(uint, address);

    modifier isContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner has access to this function!");
        _;
    }

    // check if identity is either contract owner or 
    modifier isAuthorized() {
        require(authorizedList[msg.sender] == true, "Only authorized parties have access to this function!");
        _;
    }

    modifier eitherRecipientOrIssuer(bytes memory interactionHash, address recipient) {
        uint interactionIndex = _indexOfInteractionList[recipient][interactionHash];
        address issuer = individualProfile[recipient][interactionIndex].issuer;
        require(msg.sender == recipient || msg.sender == issuer, "Only the recipient or issuer of interaction can invalidate it!");
        _;
    }

    modifier isFeedbackOwner(uint feedbackID, address institution) {
        uint index = _indexOfFeedbackList[institution][feedbackID];
        address owner = organizationFeedback[institution][index].owner;
        require(msg.sender == owner, "Only the feedback owner has access to this function!");
        _;
    }

    modifier isRegisteredInstitution (address institutionAddress) {
        require(userIdentity[institutionAddress] == Identity.institution, "Institution is not registered!");
        _;
    }

    modifier isUnregisteredUser() {
        require(userIdentity[msg.sender] == Identity.undefined, "Only unregistered uesrs have access to this function!");
        _;
    }

    // Can only be performed by contract owner, on registered institutions
    function registerCA(address addressCA) public isContractOwner() isRegisteredInstitution(addressCA) {
        authorizedList[addressCA] = true;
    }

    function registerIndividual() public isUnregisteredUser() {
        userIdentity[msg.sender] = Identity.individual;
    }

    function registerInstitution(address newInstitution) public isAuthorized() {
        userIdentity[newInstitution] = Identity.institution;
    }

    function addInteraction(bytes memory interactionHash, uint timestamp, address recipient) public isRegisteredInstitution(msg.sender) {
        Interaction memory newInteraction = Interaction(interactionHash, timestamp, msg.sender, true);
        individualProfile[recipient].push(newInteraction);
        emit AddedInteraction(recipient);
    }

    function invalidateInteraction(bytes memory interactionHash, address recipient) public eitherRecipientOrIssuer(interactionHash, recipient) {
        uint interactionIndex = _indexOfInteractionList[recipient][interactionHash];
        individualProfile[recipient][interactionIndex].isValid == false;
        emit InvalidateInteraction(interactionHash);
    }

    function addFeedback(bytes memory feedbackText, uint timestamp, address institution) public {
        uint newId = organizationFeedback[institution].length;
        Feedback memory newFeedback = Feedback(newId, feedbackText, timestamp, msg.sender, true);
        organizationFeedback[institution].push(newFeedback);
        emit AddedFeedBack(institution);
    }

    function invalidateFeedback(uint feedbackID, address institution) public isFeedbackOwner(feedbackID, institution){
        uint feedbackIndex = _indexOfFeedbackList[institution][feedbackID];
        organizationFeedback[institution][feedbackIndex].isValid == false;
        emit InvalidateFeedback(feedbackID, institution);
    }

    function getInteraction(address individual) public view returns (Interaction[] memory) {
        return individualProfile[individual];
    }

    function getFeedback(address institution) public view returns (Feedback[] memory) {
        return organizationFeedback[institution];
    }

    function checkUserIdentity(address userAddress) public view returns (Identity) {
        return userIdentity[userAddress];
    }

}