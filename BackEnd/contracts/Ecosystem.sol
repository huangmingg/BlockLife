pragma solidity ^0.5.0;

// import "./Certificate.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

// Organizations are treated as NFTs, issued by CAs
contract Ecosystem {
    using SafeMath for uint256;
    address contractOwner;
    uint256 organizationID;
    enum transactionState { pending, approved, rejected }

    constructor() public {
        contractOwner = msg.sender;
    }

    struct certificate {
        uint256 id;
        address recipient;
        uint256 issuer;
        bool isValid;
        uint256 details;
    }

    struct recommendationLetter {
        uint256 id;
        
    }

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

    mapping(uint256 => organization) organizations;
    mapping(address => bool) certificateAuthorities;
    mapping (uint256 => transactionBlock) transactionDetails;

    mapping (uint256 => transactionBlock) pendingList;

    event Pending(uint256);
    event Approved(uint256);
    event Rejected(uint256);
    event AddCA(address);
    event RemoveCA(address);

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
        emit Approved(orgID);
    }

    function removeOrganiztion(uint256 orgID) public isAuthorizedIssuer() {
        transactionDetails[orgID].state = transactionState.rejected;
        emit Rejected(orgID);
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