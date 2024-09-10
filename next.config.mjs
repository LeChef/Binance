/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });
    return config;
  },
  images: {
    domains: ["coin-images.coingecko.com"],
  },
};

export default nextConfig;
