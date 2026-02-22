/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
      process.env.AWS_S3_BUCKET
        ? {
            protocol: "https",
            hostname: `${process.env.AWS_S3_BUCKET}.s3.amazonaws.com`,
            pathname: "**",
          }
        : null,
    ].filter(Boolean),
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

module.exports = nextConfig;
