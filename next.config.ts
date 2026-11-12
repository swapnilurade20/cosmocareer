import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/',
      headers: [
        { key: 'Link', value: '<https://growmorex.in/llms.txt>; rel="describedby"; type="text/plain", <https://growmorex.in/agent-markdown>; rel="alternate"; type="text/markdown"' }
      ]
    }];
  }
};
export default nextConfig;
