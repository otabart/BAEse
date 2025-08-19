"use client";

import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Button } from "./DemoComponents";
import { useUserProfile } from "../hooks/useUserProfile";
import { useNetworkSwitch } from "../hooks/useNetworkSwitch";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import toast from "react-hot-toast";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";

interface ProfileFormData {
  name: string;
  birthDate: {
    month: string;
    day: string;
    year: string;
  };
  gender: string;
  lookingFor: string[];
  aboutMe: string;
  interestedIn: string[];
}

interface GaslessProfileCreationProps {
  onComplete: () => void;
  onBack: () => void;
}

// Contract address and ABI for gasless transactions
const USER_PROFILE_CONTRACT_ADDRESS = "0x235907357416fa06c9f226266aFFb52516FCdc47" as `0x${string}`;

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
  }
] as const;

export function GaslessProfileCreation({ onComplete, onBack }: GaslessProfileCreationProps) {
  const { address, isConnected } = useAccount();
  const { hasProfile } = useUserProfile();
  const { isCorrectNetwork, promptNetworkSwitch, isInMiniKit } = useNetworkSwitch();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTransaction, setShowTransaction] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    birthDate: {
      month: "",
      day: "",
      year: ""
    },
    gender: "",
    lookingFor: [],
    aboutMe: "",
    interestedIn: []
  });

  const genderOptions = [
    "Woman",
    "Man", 
    "Non-binary",
    "Prefer not to say"
  ];

  const lookingForOptions = [
    "Long-term relationship",
    "Short-term fun",
    "New friends", 
    "Still figuring it out"
  ];

  const interestedInOptions = [
    "Men",
    "Women", 
    "Everyone"
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBirthDateChange = (field: keyof ProfileFormData['birthDate'], value: string) => {
    setFormData(prev => ({
      ...prev,
      birthDate: {
        ...prev.birthDate,
        [field]: value
      }
    }));
  };

  const handleMultiSelect = (field: 'lookingFor' | 'interestedIn', option: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const calculateAge = () => {
    const { month, day, year } = formData.birthDate;
    if (!month || !day || !year) return 0;
    
    const monthIndex = months.indexOf(month) + 1;
    const birthDate = new Date(parseInt(year), monthIndex - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0 && 
               formData.birthDate.month && 
               formData.birthDate.day && 
               formData.birthDate.year &&
               calculateAge() >= 18 &&
               formData.gender;
      case 2:
        return formData.lookingFor.length > 0 && 
               formData.aboutMe.trim().length > 0;
      case 3:
        return formData.interestedIn.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleCreateProfile = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (hasProfile) {
      toast.error("Profile already exists");
      return;
    }

    // Check network before proceeding
    if (!isCorrectNetwork) {
      const { instructions } = promptNetworkSwitch();
      toast.error(instructions, { duration: 5000 });
      return;
    }

    const age = calculateAge();
    if (age < 18) {
      toast.error("You must be 18 or older to create a profile");
      return;
    }
    
    setShowTransaction(true);
  };

  const handleOnStatus = (status: LifecycleStatus) => {
    console.log('Transaction status:', status);
    console.log('Paymaster endpoint:', process.env.NEXT_PUBLIC_PAYMASTER_ENDPOINT);
    
    if (status.statusName === 'success') {
      toast.success("Profile created successfully!");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else if (status.statusName === 'error') {
      console.error('Transaction error:', status);
      toast.error("Failed to create profile");
    }
  };

  // Create the contract calls for the transaction
  const contracts = [
    {
      to: USER_PROFILE_CONTRACT_ADDRESS as `0x${string}`,
      abi: USER_PROFILE_ABI,
      functionName: "createProfile",
      args: [
        formData.name, 
        BigInt(calculateAge()),
        formData.gender,
        formData.lookingFor,
        formData.aboutMe,
        formData.interestedIn
      ]
    }
  ];

  // Enhanced debugging
  console.log('=== GASLESS TRANSACTION DEBUG ===');
  console.log('Contract Address:', USER_PROFILE_CONTRACT_ADDRESS);
  console.log('Form Data:', {
    name: formData.name,
    age: calculateAge(),
    gender: formData.gender,
    lookingFor: formData.lookingFor,
    aboutMe: formData.aboutMe,
    interestedIn: formData.interestedIn
  });
  console.log('Contracts Array:', JSON.stringify(contracts, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value, 2));
  console.log('Network Chain ID:', window.ethereum?.chainId);
  console.log('Is Connected:', isConnected);
  console.log('Address:', address);
  console.log('=== END DEBUG ===');

  // Handle network switching
  const handleSwitchNetwork = async () => {
    console.log('=== NETWORK SWITCH ATTEMPT ===');
    console.log('Target Chain ID:', baseSepolia.id);
    console.log('Current Chain ID:', window.ethereum?.chainId);
    console.log('switchChain available:', !!switchChain);
    
    try {
      console.log('Calling switchChain...');
      const result = await switchChain({ chainId: baseSepolia.id });
      console.log('switchChain result:', result);
      
      // Check if the network actually changed after a short delay
      setTimeout(async () => {
        if (window.ethereum?.chainId !== `0x${baseSepolia.id.toString(16)}`) {
          console.log('wagmi switchChain succeeded but network not changed, trying direct method...');
          try {
            await window.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }],
            });
            toast.success("Network switched to Base Sepolia!");
          } catch (directError: unknown) {
            console.error('Direct switch also failed:', directError);
            const directErrorCode = (directError as { code?: number })?.code;
            if (directErrorCode === 4902) {
              toast.error("Base Sepolia network not found in your wallet. Please add it manually.");
            } else {
              toast.error("Unable to switch network automatically. Please switch manually in your wallet.");
            }
          }
        } else {
          toast.success("Network switched to Base Sepolia!");
        }
      }, 1000);
      
    } catch (error: unknown) {
      console.error("=== NETWORK SWITCH ERROR ===");
      console.error("Error object:", error);
      
      const errorCode = (error as { code?: number })?.code;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error code:", errorCode);
      console.error("Error message:", errorMessage);
      
      if (errorCode === 4902 || errorCode === -32602) {
        toast.error("Please add Base Sepolia network to your wallet first");
      } else if (errorCode === 4001) {
        toast.error("Network switch rejected by user");
      } else if (errorMessage.includes('does not support')) {
        toast.error("Your wallet doesn't support automatic network switching");
      } else {
        toast.error(`Failed to switch network: ${errorMessage || 'Unknown error'}`);
      }
    }
    
    // Check if network actually changed
    setTimeout(() => {
      console.log('Chain ID after switch attempt:', window.ethereum?.chainId);
    }, 1000);
  };

  // Updated network warning component for MiniKit
  const NetworkWarning = () => {
    if (isCorrectNetwork) return null;

    const { shouldShowWarning, instructions } = promptNetworkSwitch();
    
    if (!shouldShowWarning) return null;

    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-400">⚠️</span>
          <span className="font-medium text-yellow-200">Wrong Network</span>
        </div>
        <p className="text-yellow-200 text-sm mb-3">
          {instructions}
        </p>
        
        {/* Switch Network Button */}
        <div className="mb-3">
          <Button
            onClick={handleSwitchNetwork}
            disabled={isSwitchingChain}
            variant="outline"
            size="sm"
            className="bg-yellow-600/20 border-yellow-400/50 text-yellow-200 hover:bg-yellow-500/30"
          >
            {isSwitchingChain ? "Switching..." : "Switch to Base Sepolia"}
          </Button>
        </div>
        
        {isInMiniKit ? (
          <div className="text-xs text-yellow-300">
            💡 <strong>Tip:</strong> If the button doesn&apos;t work, try: Base app → wallet icon → Settings → switch to Base Sepolia
          </div>
        ) : (
          <div className="text-xs text-yellow-300">
            💡 <strong>Tip:</strong> If the button doesn&apos;t work, manually add Base Sepolia to your wallet
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Let&apos;s get to know you</h2>
              <p className="text-gray-300">Tell us the essentials</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                What&apos;s your first name?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your name"
                maxLength={50}
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                When&apos;s your birthday?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={formData.birthDate.month}
                  onChange={(e) => handleBirthDateChange('month', e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  value={formData.birthDate.day}
                  onChange={(e) => handleBirthDateChange('day', e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Day</option>
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                    <option key={day} value={day.toString()}>{day}</option>
                  ))}
                </select>
                <select
                  value={formData.birthDate.year}
                  onChange={(e) => handleBirthDateChange('year', e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Year</option>
                  {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 18 - i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              {formData.birthDate.month && formData.birthDate.day && formData.birthDate.year && (
                <p className="text-sm text-gray-400 mt-2">
                  Age: {calculateAge()} years old
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                How do you identify?
              </label>
              <div className="space-y-2">
                {genderOptions.map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mr-3 text-purple-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Share your vibe</h2>
              <p className="text-gray-300">Help others understand what you&apos;re looking for</p>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                What are you looking for?
              </label>
              <div className="space-y-2">
                {lookingForOptions.map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750">
                    <input
                      type="checkbox"
                      checked={formData.lookingFor.includes(option)}
                      onChange={() => handleMultiSelect('lookingFor', option)}
                      className="mr-3 text-purple-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* About Me */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                About me
              </label>
              <textarea
                value={formData.aboutMe}
                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={100}
              />
              <p className="text-sm text-gray-400 mt-1">
                {formData.aboutMe.length}/100 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Almost done!</h2>
              <p className="text-gray-300">Set your preferences</p>
            </div>

            {/* Interested In */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                I&apos;m interested in...
              </label>
              <div className="space-y-2">
                {interestedInOptions.map(option => (
                  <label key={option} className="flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750">
                    <input
                      type="checkbox"
                      checked={formData.interestedIn.includes(option)}
                      onChange={() => handleMultiSelect('interestedIn', option)}
                      className="mr-3 text-purple-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Profile Summary</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Age:</span> {calculateAge()} years old</p>
                <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                <p><span className="font-medium">Looking for:</span> {formData.lookingFor.join(", ")}</p>
                <p><span className="font-medium">Interested in:</span> {formData.interestedIn.join(", ")}</p>
                <p><span className="font-medium">About:</span> {formData.aboutMe}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-6">You need to connect your wallet to create a profile</p>
        <Button onClick={onBack} variant="secondary">
          Go Back
        </Button>
      </div>
    );
  }

  if (showTransaction) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <p className="text-blue-200 text-sm">
              🚀 <strong>Base App:</strong> Profile creation is gasless with Base wallet. 
              External wallets may require small fees (~$0.01) for testing.
            </p>
          </div>
        </div>

        <NetworkWarning />

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <Transaction
            contracts={contracts}
            isSponsored={true}
            onStatus={handleOnStatus}
          >
            <TransactionButton 
              text="Create Profile (Gasless)" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              disabled={!isCorrectNetwork}
            />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => setShowTransaction(false)} variant="secondary">
            Back to Form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <NetworkWarning />
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 gap-4">
        <Button 
          onClick={handleBack}
          variant="secondary"
          className="flex-1"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < 3 ? (
          <Button 
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleCreateProfile}
            disabled={!isStepValid(currentStep)}
            className="flex-1"
          >
            Create Profile (Gasless)
          </Button>
        )}
      </div>
    </div>
  );
}