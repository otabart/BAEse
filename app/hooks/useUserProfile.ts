"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
// parseEther removed - not needed for profile contract
import toast from "react-hot-toast";

// Contract ABI for UserProfile.sol
const USER_PROFILE_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string"
      },
      {
        internalType: "uint256", 
        name: "_age",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_gender",
        type: "string"
      },
      {
        internalType: "string[]",
        name: "_lookingFor",
        type: "string[]"
      },
      {
        internalType: "string",
        name: "_aboutMe",
        type: "string"
      },
      {
        internalType: "string[]",
        name: "_interestedIn",
        type: "string[]"
      }
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user", 
        type: "address"
      }
    ],
    name: "getProfile",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "string",
            name: "name", 
            type: "string"
          },
          {
            internalType: "uint256",
            name: "age",
            type: "uint256"
          },
          {
            internalType: "string",
            name: "gender",
            type: "string"
          },
          {
            internalType: "string[]",
            name: "lookingFor",
            type: "string[]"
          },
          {
            internalType: "string",
            name: "aboutMe",
            type: "string"
          },
          {
            internalType: "string[]",
            name: "interestedIn",
            type: "string[]"
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool"
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256"
          }
        ],
        internalType: "struct UserProfile.Profile",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "hasProfile",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "_age", 
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_gender",
        type: "string"
      },
      {
        internalType: "string[]",
        name: "_lookingFor",
        type: "string[]"
      },
      {
        internalType: "string",
        name: "_aboutMe",
        type: "string"
      },
      {
        internalType: "string[]",
        name: "_interestedIn",
        type: "string[]"
      }
    ],
    name: "updateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address"
      }
    ],
    name: "getLookingFor",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address"
      }
    ],
    name: "getInterestedIn",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "age",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "gender",
        type: "string"
      }
    ],
    name: "ProfileCreated",
    type: "event"
  }
] as const;

// Contract address on Base Sepolia testnet
const USER_PROFILE_CONTRACT_ADDRESS = "0x235907357416fa06c9f226266aFFb52516FCdc47";

export interface UserProfile {
  owner: string;
  name: string;
  age: number;
  gender: string;
  lookingFor: string[];
  aboutMe: string;
  interestedIn: string[];
  isActive: boolean;
  createdAt: number;
}

export function useUserProfile() {
  const { address, isConnected } = useAccount();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Write contract functions
  const { writeContract, isPending: isWritePending } = useWriteContract();

  // Read functions
  const { data: hasProfile, refetch: refetchHasProfile } = useReadContract({
    address: USER_PROFILE_CONTRACT_ADDRESS,
    abi: USER_PROFILE_ABI,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && isConnected)
    }
  });

  const { data: profileData, refetch: refetchProfile } = useReadContract({
    address: USER_PROFILE_CONTRACT_ADDRESS,
    abi: USER_PROFILE_ABI,
    functionName: "getProfile", 
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && isConnected && hasProfile)
    }
  });

  const createProfile = async (
    name: string, 
    age: number, 
    gender: string,
    lookingFor: string[],
    aboutMe: string,
    interestedIn: string[]
  ) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return false;
    }

    if (hasProfile) {
      toast.error("Profile already exists");
      return false;
    }

    if (age < 18 || age > 100) {
      toast.error("Age must be between 18 and 100");
      return false;
    }

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return false;
    }

    if (!gender.trim()) {
      toast.error("Gender cannot be empty");
      return false;
    }

    if (lookingFor.length === 0) {
      toast.error("Looking for cannot be empty");
      return false;
    }

    if (!aboutMe.trim()) {
      toast.error("About me cannot be empty");
      return false;
    }

    if (interestedIn.length === 0) {
      toast.error("Interested in cannot be empty");
      return false;
    }

    setIsCreatingProfile(true);

    try {
      const hash = await writeContract({
        address: USER_PROFILE_CONTRACT_ADDRESS,
        abi: USER_PROFILE_ABI,
        functionName: "createProfile",
        args: [name, BigInt(age), gender, lookingFor, aboutMe, interestedIn]
      });

      toast.success("Profile creation transaction submitted!");
      
      // Refetch data after transaction
      setTimeout(() => {
        refetchHasProfile();
        refetchProfile();
      }, 2000);

      return hash;
    } catch (error: unknown) {
      console.error("Profile creation error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Profile already exists")) {
        toast.error("Profile already exists");
      } else if (errorMessage.includes("Invalid age")) {
        toast.error("Invalid age (must be 18-100)");
      } else if (errorMessage.includes("Name cannot be empty")) {
        toast.error("Name cannot be empty");
      } else if (errorMessage.includes("Gender cannot be empty")) {
        toast.error("Gender cannot be empty");
      } else if (errorMessage.includes("Looking for cannot be empty")) {
        toast.error("Looking for cannot be empty");
      } else if (errorMessage.includes("About me cannot be empty")) {
        toast.error("About me cannot be empty");
      } else if (errorMessage.includes("Interested in cannot be empty")) {
        toast.error("Interested in cannot be empty");
      } else if (errorMessage.includes("User rejected")) {
        toast.error("Transaction was rejected");
      } else {
        toast.error("Failed to create profile. Please try again.");
      }
      
      return false;
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const updateProfile = async (
    name: string, 
    age: number,
    gender: string,
    lookingFor: string[],
    aboutMe: string,
    interestedIn: string[]
  ) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return false;
    }

    if (!hasProfile) {
      toast.error("Profile does not exist");
      return false;
    }

    if (age < 18 || age > 100) {
      toast.error("Age must be between 18 and 100");
      return false;
    }

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return false;
    }

    if (!gender.trim()) {
      toast.error("Gender cannot be empty");
      return false;
    }

    if (lookingFor.length === 0) {
      toast.error("Looking for cannot be empty");
      return false;
    }

    if (!aboutMe.trim()) {
      toast.error("About me cannot be empty");
      return false;
    }

    if (interestedIn.length === 0) {
      toast.error("Interested in cannot be empty");
      return false;
    }

    setIsUpdatingProfile(true);

    try {
      const hash = await writeContract({
        address: USER_PROFILE_CONTRACT_ADDRESS,
        abi: USER_PROFILE_ABI,
        functionName: "updateProfile",
        args: [name, BigInt(age), gender, lookingFor, aboutMe, interestedIn]
      });

      toast.success("Profile update transaction submitted!");
      
      // Refetch data after transaction
      setTimeout(() => {
        refetchProfile();
      }, 2000);

      return hash;
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Profile does not exist")) {
        toast.error("Profile does not exist");
      } else if (errorMessage.includes("Invalid age")) {
        toast.error("Invalid age (must be 18-100)");
      } else if (errorMessage.includes("Name cannot be empty")) {
        toast.error("Name cannot be empty");
      } else if (errorMessage.includes("Gender cannot be empty")) {
        toast.error("Gender cannot be empty");
      } else if (errorMessage.includes("Looking for cannot be empty")) {
        toast.error("Looking for cannot be empty");
      } else if (errorMessage.includes("About me cannot be empty")) {
        toast.error("About me cannot be empty");
      } else if (errorMessage.includes("Interested in cannot be empty")) {
        toast.error("Interested in cannot be empty");
      } else if (errorMessage.includes("User rejected")) {
        toast.error("Transaction was rejected");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
      
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Parse profile data with debugging
  const profile: UserProfile | null = profileData ? {
    owner: profileData.owner,
    name: profileData.name, 
    age: Number(profileData.age),
    gender: profileData.gender,
    lookingFor: [...profileData.lookingFor],
    aboutMe: profileData.aboutMe,
    interestedIn: [...profileData.interestedIn],
    isActive: profileData.isActive,
    createdAt: Number(profileData.createdAt)
  } : null;

  // Debug logging
  console.log('useUserProfile debug:', {
    address,
    isConnected,
    hasProfile,
    hasProfileType: typeof hasProfile,
    profileData,
    contractAddress: USER_PROFILE_CONTRACT_ADDRESS,
    queryEnabled: Boolean(address && isConnected),
  });

  return {
    // State
    address,
    isConnected,
    hasProfile: Boolean(hasProfile),
    profile,
    
    // Loading states
    isCreatingProfile,
    isUpdatingProfile,
    isWritePending,
    
    // Functions
    createProfile,
    updateProfile,
    refetchHasProfile,
    refetchProfile,
    
    // Contract info
    contractAddress: USER_PROFILE_CONTRACT_ADDRESS
  };
}