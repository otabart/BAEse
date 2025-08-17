/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure external image domains
  images: {
    domains: ['images.unsplash.com'],
  },
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Handle Chrome extension errors gracefully
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' chrome-extension:; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
