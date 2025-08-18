"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useNetworkSwitch() {
  const { chain } = useAccount();
  const { context } = useMiniKit();
  const [, setCurrentChainId] = useState<string | null>(null);

  const isCorrectNetwork = chain?.id === baseSepolia.id;

  // Monitor chain changes via window.ethereum (for detection only)
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const updateChainId = () => {
        if (window.ethereum?.chainId) {
          setCurrentChainId(window.ethereum.chainId);
        }
      };

      updateChainId();

      // Listen for chain changes
      if (window.ethereum.on) {
        window.ethereum.on('chainChanged', updateChainId);
        return () => {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener('chainChanged', updateChainId);
          }
        };
      }
    }
  }, []);

  // For MiniKit apps, we should guide users to switch manually
  // rather than programmatically switching which can interfere with MiniKit
  const promptNetworkSwitch = () => {
    // In MiniKit context, provide instructions rather than auto-switching
    return {
      shouldShowWarning: !isCorrectNetwork,
      instructions: `Please switch to Base Sepolia (Chain ID: 84532) in your wallet settings to use gasless transactions.`,
    };
  };

  return {
    isCorrectNetwork,
    currentChainId: chain?.id,
    promptNetworkSwitch,
    isInMiniKit: !!context,
  };
}
