// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title UserProfile
 * @dev Simple user profile contract for BAEse dating platform
 */
contract UserProfile {
    struct Profile {
        address owner;
        string name;
        uint256 age;
        string gender;
        string[] lookingFor;
        string aboutMe;
        string[] interestedIn;
        bool isActive;
        uint256 createdAt;
    }

    mapping(address => Profile) public profiles;
    mapping(address => bool) public hasProfile;
    
    uint256 public totalProfiles;

    event ProfileCreated(address indexed user, string name, uint256 age, string gender);
    event ProfileUpdated(address indexed user, string name, uint256 age, string gender);

    modifier onlyProfileOwner() {
        require(hasProfile[msg.sender], "Profile does not exist");
        require(profiles[msg.sender].owner == msg.sender, "Not profile owner");
        _;
    }

    function createProfile(
        string memory _name, 
        uint256 _age, 
        string memory _gender,
        string[] memory _lookingFor,
        string memory _aboutMe,
        string[] memory _interestedIn
    ) external {
        require(!hasProfile[msg.sender], "Profile already exists");
        require(_age >= 18 && _age <= 100, "Invalid age");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_gender).length > 0, "Gender cannot be empty");
        require(_lookingFor.length > 0, "Looking for cannot be empty");
        require(bytes(_aboutMe).length > 0, "About me cannot be empty");
        require(_interestedIn.length > 0, "Interested in cannot be empty");

        profiles[msg.sender] = Profile({
            owner: msg.sender,
            name: _name,
            age: _age,
            gender: _gender,
            lookingFor: _lookingFor,
            aboutMe: _aboutMe,
            interestedIn: _interestedIn,
            isActive: true,
            createdAt: block.timestamp
        });

        hasProfile[msg.sender] = true;
        totalProfiles++;

        emit ProfileCreated(msg.sender, _name, _age, _gender);
    }

    function updateProfile(
        string memory _name, 
        uint256 _age,
        string memory _gender,
        string[] memory _lookingFor,
        string memory _aboutMe,
        string[] memory _interestedIn
    ) external onlyProfileOwner {
        require(_age >= 18 && _age <= 100, "Invalid age");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_gender).length > 0, "Gender cannot be empty");
        require(_lookingFor.length > 0, "Looking for cannot be empty");
        require(bytes(_aboutMe).length > 0, "About me cannot be empty");
        require(_interestedIn.length > 0, "Interested in cannot be empty");

        profiles[msg.sender].name = _name;
        profiles[msg.sender].age = _age;
        profiles[msg.sender].gender = _gender;
        profiles[msg.sender].lookingFor = _lookingFor;
        profiles[msg.sender].aboutMe = _aboutMe;
        profiles[msg.sender].interestedIn = _interestedIn;

        emit ProfileUpdated(msg.sender, _name, _age, _gender);
    }

    function getProfile(address _user) external view returns (Profile memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user];
    }

    function deactivateProfile() external onlyProfileOwner {
        profiles[msg.sender].isActive = false;
    }

    function activateProfile() external onlyProfileOwner {
        profiles[msg.sender].isActive = true;
    }

    function getLookingFor(address _user) external view returns (string[] memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user].lookingFor;
    }

    function getInterestedIn(address _user) external view returns (string[] memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user].interestedIn;
    }
}