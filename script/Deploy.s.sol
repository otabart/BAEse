// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/UserProfile.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy UserProfile contract
        UserProfile userProfile = new UserProfile();
        
        console.log("UserProfile deployed to:", address(userProfile));
        console.log("Total profiles initialized:", userProfile.totalProfiles());
        
        vm.stopBroadcast();
    }
}