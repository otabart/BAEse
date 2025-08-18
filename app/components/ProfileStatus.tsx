"use client";

import { useUserProfile } from "../hooks/useUserProfile";
import { Button } from "./DemoComponents";

interface ProfileStatusProps {
  onCreateProfile: () => void;
  onEditProfile?: () => void;
}

export function ProfileStatus({ onCreateProfile, onEditProfile }: ProfileStatusProps) {
  const { 
    isConnected, 
    hasProfile, 
    profile, 
    address, 
    contractAddress 
  } = useUserProfile();

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Profile Status</h2>
          <p className="text-gray-300 mb-4">Connect your wallet to view your profile</p>
          <div className="text-sm text-gray-400">
            <p>Contract: {contractAddress}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create Your Profile</h2>
          <p className="text-gray-300 mb-6">You don&apos;t have a dating profile yet. Create one to get started!</p>
          
          <Button onClick={onCreateProfile} className="w-full mb-4">
            Create Profile
          </Button>
          
          <div className="text-sm text-gray-400 space-y-1">
            <p>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p>Contract: {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (profile) {
    const createdDate = new Date(profile.createdAt * 1000).toLocaleDateString();
    
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Profile</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.isActive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">{profile.name}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="font-medium text-gray-200">Age:</span> {profile.age} years old</p>
                <p><span className="font-medium text-gray-200">Created:</span> {createdDate}</p>
                <p><span className="font-medium text-gray-200">Owner:</span> {profile.owner?.slice(0, 6)}...{profile.owner?.slice(-4)}</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Profile Details</h4>
              <p className="text-xs text-gray-400">
                This profile is stored on the Base blockchain and verified through your connected wallet.
              </p>
            </div>

            {onEditProfile && (
              <Button onClick={onEditProfile} variant="secondary" className="w-full">
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Contract: {contractAddress}</p>
          <a 
            href={`https://sepolia.basescan.org/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            View on BaseScan ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Loading Profile...</h2>
        <div className="animate-pulse bg-gray-700 h-4 rounded mb-2"></div>
        <div className="animate-pulse bg-gray-700 h-4 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
}