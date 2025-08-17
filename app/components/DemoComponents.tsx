"use client";

import React, { type ReactNode, useState } from "react";
import { useAccount } from "wagmi";
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import Image from 'next/image';
import {
  ConnectWallet,
} from "@coinbase/onchainkit/wallet";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Minimalistic and beautiful UI design
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Responsive layout for all devices
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Dark mode support
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              OnchainKit integration
            </span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({ setActiveTab }: HomeProps) {
  const { isConnected } = useAccount();

  // If wallet is connected, show the Tinder-like UI
  if (isConnected) {
    return <TinderLikeUI setActiveTab={setActiveTab} />;
  }

  // If wallet is not connected, show the connect wallet screen
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section - Prediction Market */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🔮 Prediction Market</h1>
        <p className="text-sm opacity-90 mb-4">
          Swipe to predict the future. Win rewards for accurate predictions.
        </p>
        <ConnectWallet className="bg-white/20 hover:bg-white/30 text-white border-0 inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none text-sm px-4 py-2 rounded-lg">
          <span className="flex items-center mr-2">
            <span className="text-lg">💰</span>
          </span>
          Connect Wallet
        </ConnectWallet>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--app-card-bg)] rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm font-medium">Live Markets</div>
          <div className="text-xs opacity-75">Real-time odds</div>
        </div>
        <div className="bg-[var(--app-card-bg)] rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-sm font-medium">Win Rewards</div>
          <div className="text-xs opacity-75">Earn from predictions</div>
        </div>
        <div className="bg-[var(--app-card-bg)] rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm font-medium">Leaderboard</div>
          <div className="text-xs opacity-75">Compete globally</div>
        </div>
        <div className="bg-[var(--app-card-bg)] rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm font-medium">Instant Bets</div>
          <div className="text-xs opacity-75">One swipe betting</div>
        </div>
      </div>
    </div>
  );
}

// Mock data for people/predictions with photo placeholders
const mockPeople = [
  {
    id: 1,
    name: "Alex Chen",
    age: 28,
    prediction: "ETH will reach $4,000 by end of 2024",
    confidence: "85%",
    category: "Crypto",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    bio: "Crypto analyst with 5+ years experience. Bullish on Ethereum's potential.",
  },
  {
    id: 2,
    name: "Sarah Kim",
    age: 24,
    prediction: "Farcaster will hit 1M daily users",
    confidence: "72%",
    category: "Social",
    photo: "https://images.unsplash.com/photo-1494790108755-2616c5e8b7af?w=400&h=600&fit=crop&crop=face",
    bio: "Social media strategist. Believes in decentralized social platforms.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    age: 32,
    prediction: "Base TVL will exceed $10B",
    confidence: "68%",
    category: "DeFi",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    bio: "DeFi researcher focused on Layer 2 solutions and scaling.",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    age: 29,
    prediction: "Bitcoin will reach new ATH",
    confidence: "91%",
    category: "Crypto",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    bio: "Bitcoin maximalist and technical analyst. Strong believer in digital gold.",
  },
];

interface TinderLikeUIProps {
  setActiveTab: (tab: string) => void;
}

function TinderLikeUI({ setActiveTab }: TinderLikeUIProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gone] = useState(() => new Set<number>());

  const currentPerson = mockPeople[currentIndex];
  const nextPerson = mockPeople[currentIndex + 1];

  // Spring animation for the current card
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    opacity: 1,
    config: {
      friction: 50,
      tension: 500,
      mass: 1
    },
  }));

  // Spring animation for the next card
  const [nextProps, nextApi] = useSpring(() => ({
    scale: 0.95,
    opacity: 0.7,
    config: {
      friction: 60,
      tension: 400
    },
  }));

  // Drag gesture handler
  const bind = useDrag(({
    active,
    movement: [mx],
    direction: [xDir],
    velocity: [vx],
  }) => {
    const trigger = vx > 0.2; // Trigger threshold for swipe
    const dir = xDir < 0 ? -1 : 1;
    const isGone = !active && trigger;
    const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
    const rot = mx / 100 + (isGone ? dir * 10 * vx : 0);
    const scale = active ? 1.05 : 1;
    const opacity = isGone ? 0 : 1;

    if (isGone) {
      gone.add(currentIndex);

      // Handle the swipe action
      if (dir === 1) {
        console.log('Liked:', currentPerson?.prediction);
      } else {
        console.log('Disliked:', currentPerson?.prediction);
      }
    }

    // Animate current card
    api({
      x,
      rot,
      scale,
      opacity,
      config: {
        friction: 50,
        tension: active ? 800 : isGone ? 200 : 500,
        mass: 1
      },
      onRest: () => {
        if (isGone) {
          setCurrentIndex(prev => (prev + 1) % mockPeople.length);
          gone.delete(currentIndex);
          // Reset the card position
          api.set({ x: 0, rot: 0, scale: 1, opacity: 1 });
        }
      },
    });

    // Animate next card to come forward
    if (nextPerson) {
      nextApi({
        scale: active ? 0.97 : 0.95,
        opacity: active ? 0.9 : 0.7,
      });
    }
  });

  if (!currentPerson) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-[var(--app-foreground)]">All caught up!</h2>
        <p className="text-[var(--app-foreground-muted)]">Check back later for more predictions.</p>
        <div className="space-y-3">
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-6 py-2 bg-[var(--app-accent)] text-white rounded-lg hover:bg-[var(--app-accent-hover)] transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-1">
          🔮 Prediction Market
        </h1>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Swipe left to disagree, right to agree
        </p>
      </div>

      {/* Card Stack Container */}
      <div className="relative h-[520px] flex items-center justify-center overflow-hidden">
        {/* Next card (background) */}
        {nextPerson && (
          <animated.div
            style={nextProps}
            className="absolute inset-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <CardContent person={nextPerson} />
          </animated.div>
        )}

        {/* Current card (foreground) */}
        <animated.div
          {...bind(currentIndex)}
          style={{
            ...props,
            touchAction: 'none',
          }}
          className="absolute inset-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          <CardContent person={currentPerson} />

          {/* Swipe indicators */}
          <animated.div
            style={{
              opacity: props.x.to(x => Math.abs(x) / 100),
              left: props.x.to(x => x > 0 ? '20px' : 'auto'),
              right: props.x.to(x => x < 0 ? '20px' : 'auto'),
            }}
            className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
          >
            <animated.div
              style={{
                color: props.x.to(x => x > 0 ? '#10B981' : '#EF4444'),
                transform: props.x.to(x => `scale(${Math.min(Math.abs(x) / 100, 1.5)})`),
              }}
              className="text-6xl font-bold drop-shadow-lg"
            >
              {props.x.to(x => x > 50 ? '✓' : x < -50 ? '✗' : '')}
            </animated.div>
          </animated.div>

          {/* Colored overlay for swipe feedback */}
          <animated.div
            style={{
              opacity: props.x.to(x => Math.abs(x) / 300),
              backgroundColor: props.x.to(x => x > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
            }}
            className="absolute inset-0 pointer-events-none"
          />
        </animated.div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-[var(--app-foreground-muted)] space-y-2">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center space-x-2 opacity-75">
            <span className="text-red-400 text-lg">✗</span>
            <span>Swipe left to disagree</span>
          </div>
          <div className="flex items-center space-x-2 opacity-75">
            <span className="text-green-400 text-lg">✓</span>
            <span>Swipe right to agree</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center space-x-2">
        {mockPeople.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
              ? 'bg-[var(--app-accent)] scale-125'
              : index < currentIndex
                ? 'bg-green-400'
                : 'bg-gray-300 dark:bg-gray-600'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for card content to keep it clean
function CardContent({ person }: { person: typeof mockPeople[0] }) {
  return (
    <>
      {/* Photo */}
      <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          className="object-cover transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-6xl font-bold -z-10">
          {person.name.charAt(0)}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
          {person.category}
        </div>

        {/* Confidence badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold">
          {person.confidence}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--app-foreground)] mb-1">
            {person.name}, {person.age}
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
            {person.bio}
          </p>
        </div>

        <div className="bg-[var(--app-card-bg)] rounded-xl p-4 border border-[var(--app-card-border)]">
          <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
            Prediction:
          </h3>
          <p className="text-[var(--app-foreground-muted)] text-sm leading-relaxed">
            &ldquo;{person.prediction}&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}

type IconProps = {
  name: "heart" | "star" | "check" | "plus" | "arrow-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}



