/** @type {import('next').NextConfig} */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
        })
      );
    }

    // Bundle analysis configuration
    if (process.env.BUNDLE_ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
          openAnalyzer: false,
        })
      );
    }

    // Optimize chunk splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for common libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              enforce: true,
            },
            // React and Next.js specific chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI components chunk
            ui: {
              name: 'ui',
              chunks: 'all',
              test: /[\\/](components[\\/]ui|@radix-ui|lucide-react)[\\/]/,
              priority: 30,
              enforce: true,
            },
            // Common utilities chunk
            lib: {
              name: 'lib',
              chunks: 'all',
              test: /[\\/](lib|hooks|contexts)[\\/]/,
              priority: 25,
              minChunks: 2,
              enforce: true,
            },
            // Large libraries chunk
            heavy: {
              name: 'heavy',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react-select|framer-motion|@clerk)[\\/]/,
              priority: 35,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
  images: {
    domains: ['api.dicebear.com', 'source.unsplash.com', 'emqozkcwoekqiibyempf.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable modern bundling features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Enable gzip compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Enable static optimization
  output: 'standalone',
  // CSS optimization
  optimizeFonts: true,
  // Enable CSS modules optimization
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}.js',
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);