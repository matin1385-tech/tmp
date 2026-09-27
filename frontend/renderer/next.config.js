module.exports = {
  output: 'export',
  distDir:
    process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
