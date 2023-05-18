module.exports = {
  // distDir: 'build',
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'www.pexels.com'],
  },
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  }
}