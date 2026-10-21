const envalid = require('envalid');

const authDependent = envalid.makeValidator((x) => {
  const authEnabled = process.env.HEALTH_AUTH === 'true';
  if (authEnabled && !x.length) {
    throw new Error(`Can't be empty if "HEALTH_AUTH" is true`);
  }
  return x;
});

envalid.cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: envalid.str(),
  HEALTH_AUTH: envalid.bool(),
  HEALTH_USERNAME: authDependent(),
  HEALTH_PASSWORD: authDependent(),
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const domainName = process.env.DOMAIN_NAME;
// Standalone output is only needed for the Docker image; local dev and CI use the default output.
const shouldUseStandaloneOutput = process.env.NEXT_OUTPUT === 'standalone';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

module.exports = withBundleAnalyzer({
  output: shouldUseStandaloneOutput ? 'standalone' : undefined,
  images: {
    remotePatterns: domainName
      ? [
          { protocol: 'https', hostname: domainName },
          { protocol: 'http', hostname: domainName },
        ]
      : [],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sassOptions: {
    prependData: `$basePath: '${process.env.NEXT_PUBLIC_BASE_PATH}';`,
  },
  experimental: {
    // NOTE: never add dayjs here, it breaks the sv locale.
    optimizePackageImports: ['@sk-web-gui/core', '@sk-web-gui/react'],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async rewrites() {
    return [{ source: '/napi/:path*', destination: '/api/:path*' }];
  },
});
