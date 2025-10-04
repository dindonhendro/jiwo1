/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com']
  }
};

module.exports = nextConfig;