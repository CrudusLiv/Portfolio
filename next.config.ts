import type { NextConfig } from 'next'

const repoName = 'Portfolio'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['10.150.211.139'],
}

export default nextConfig
