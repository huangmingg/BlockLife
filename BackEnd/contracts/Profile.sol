pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Profile {
    using SafeMath for uint256;
    address contractOwner;

    constructor() public {
        contractOwner = msg.sender;
    }

    struct profile {
        string name;
        string DOB;
    }

    mapping(address => profile) profiles;

    mapping(address => mapping(address => bool)) authorizedViews;

    modifier isContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner has access to this function!");
        _;
    }

    modifier isProfileOwner(address profileOwner) {
        require(msg.sender == profileOwner, "Only the owner of profile has access to this function");
        _;
    }

    modifier isAuthorized(address profileOwner) {
        require(profiles[profileOwner][msg.sender] == true, "Unable to view profile as owner has not given permission");
        _;
    }

    function updateProfile(bytes32 _name, bytes32 _DOB) public {
        profiles[msg.sender].name = _name;
        profiles[msg.sender].DOB = _DOB;
    }


    function retrieveProfile(address profileOwner) public view isAuthorized(profileOwner) {
        return profiles[profileOwner];
    }

}
