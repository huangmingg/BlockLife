pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Ecosystem {
    using SafeMath for uint256;
    address contractOwner;
    uint256 organizationID;
    uint256 entityID;

    enum transactionState { pending, approved, rejected }

    constructor() public {
        contractOwner = msg.sender;
    }

    //entity Type 1 - Certificate; Type 2 - Recommandation Letter; 3 - Review 
    struct entity {
        uint256 entityType;
        bytes32 entityName;
        uint256 referenceID;
        address recipient;
        uint256 issuingOrganization;
        address issuer;
        bytes32 details;
        bool isValid;
    }

    mapping(uint256 => entity) entityData;

    struct transactionBlock {
        address certifiedAuthority;
        transactionState state;
    }

    struct organization {
        address creator;
        bytes32 name;
        bytes32 UEN; 
        bytes16 industry;
        bytes32 listedAddress;
        bool isValid;
    }

    mapping (uint256 => organization) organizations;
    mapping (address => bool) certificateAuthorities;
    mapping (uint256 => transactionBlock) transactionDetails;
    mapping (uint256 => transactionBlock) pendingList;

    // Permission Level checks the permission of an address in an organization 
    // 0 is lowest (not an employee); 1 is low level staff; 2 is managerial role; 3 is even higher; 4 is owner
    // 3 >= to enable permission
    // 4 to change owner
    // 2 >= to issue entity

    mapping (address => mapping(uint256 => uint8)) permissionLevel; 

    event Pending(uint256);
    event Approved(uint256);
    event Rejected(uint256);
    event AddCA(address);
    event RemoveCA(address);
    event IssueEntity(uint256);
    event RevokeEntity(uint256);

    modifier sufficientPermission(uint256 orgId, uint256 requiredLevel) {
        require(permissionLevel[msg.sender][orgId] >= requiredLevel, "User has insufficient permission to perform this function");
        _;
    }

    modifier isContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner has access to this function!");
        _;
    }

    // Contract owner is always an authorized CA
    modifier isAuthorizedIssuer() {
        require(certificateAuthorities[msg.sender] == true || msg.sender == contractOwner, "Only authorized CA has access to this function!");
        _;
    }

    function addToCA(address addressCA) public isContractOwner() {
        certificateAuthorities[addressCA] = true;
        emit AddCA(addressCA);
    }

    function removeFromCA(address addressCA) public isContractOwner() {
        certificateAuthorities[addressCA] = false;
        emit RemoveCA(addressCA);
    }

    // When an organization applies to join the network for the first time
    function createOrganization(bytes32 name, bytes32 UEN, bytes16 industry, bytes32 listedAddress) public {
        uint256 newOrgID = organizationID;

        organization memory newOrg = organization(msg.sender, name, UEN, industry, listedAddress, false);
        organizations[newOrgID] = newOrg; 

        transactionBlock memory newBlock = transactionBlock(address(0), transactionState.pending);
        transactionDetails[newOrgID] = newBlock;

        organizationID = organizationID.add(1);
        emit Pending(newOrgID);
    }

    function approveOrganization(uint256 orgID) public isAuthorizedIssuer() {
        organizations[orgID].isValid = true;
        transactionDetails[orgID].certifiedAuthority = address(this);
        transactionDetails[orgID].state = transactionState.approved;

        // Set permission level for owner
        address ownerAddress = organizations[orgID].creator;

        permissionLevel[ownerAddress][orgID] = 4;
        emit Approved(orgID);
    }

    function removeOrganiztion(uint256 orgID) public isAuthorizedIssuer() {
        transactionDetails[orgID].state = transactionState.rejected;
        emit Rejected(orgID);
    }

    function editEmployee(address newEmployee, uint256 orgId, uint8 permission) public sufficientPermission(orgId, 2) {
        permissionLevel[newEmployee][orgId] = permission;        
    }

    function issueEntity(uint256 entityType, 
                        bytes32 entityName, 
                        uint256 referenceID, 
                        address recipient, 
                        uint256 issuingOrganization,
                        bytes32 details) public sufficientPermission(issuingOrganization, 2) {
        uint256 newEntityID = entityID;

        entity memory newEntity = entity(entityType, entityName, referenceID, recipient, issuingOrganization, msg.sender, details, true);
        entityData[newEntityID] = newEntity;

        entityID = entityID.add(1);
    }

    function invalidateEntity(uint256 entityid, uint256 issuingOrganization) public sufficientPermission(issuingOrganization, 3) {
        entityData[entityid].isValid = false;
    }

    // Getter functions which are available for all stakeholders in the network
    function getName(uint256 id) public view returns(bytes32) {
        return organizations[id].name;
    }

    function getUEN(uint256 id) public view returns(bytes32) {
        return organizations[id].UEN;
    }

    function getIndustry(uint256 id) public view returns(bytes16) {
        return organizations[id].industry;
    }

    function getAddress(uint256 id) public view returns(bytes32) {
        return organizations[id].listedAddress;
    }

    function numberOrganization() public view returns(uint256) {
        return organizationID;
    }

    function getContractOwner() public view returns(address) {
        return contractOwner;
    }






}