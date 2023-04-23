const { config } = require('dotenv');

const { parsed: localEnv } = config();
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'www.pexels.com'],
  },
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: localEnv
      ? localEnv.GOOGLE_APPLICATION_CREDENTIALS
      : undefined,
  },
}