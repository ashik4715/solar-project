/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  images: {
    domains: [
      "localhost",
      process.env.AWS_S3_BUCKET
        ? `${process.env.AWS_S3_BUCKET}.s3.amazonaws.com`
        : "",
    ].filter(Boolean),
    unoptimized: true, // For local development
  },
};

module.exports = nextConfig;
