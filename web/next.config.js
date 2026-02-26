/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ['th'],
  //   defaultLocale: 'th',
  // },
  // output: 'standalone',
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'venuee-static.s3-ap-southeast-1.amazonaws.com',
      },
    ],
    // loader: 'custom',
    // loaderFile: './image-loader.js',
    deviceSizes: [360, 480, 640, 960, 1080, 1200]
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  redirects: async () => {
    return [
      {
        source: '/categories/wireless-camera',
        destination: '/categories/wireless-camera-cctv',
        permanent: true,
      },
      {
        source: "/categories/4g-sim-card-camera-cctv",
        destination: '/categories/wireless-camera-cctv',
        permanent: true,
      },
      {
        source: "/categories/lpr-license-plate-recognition-camera",
        destination: '/categories/icp-ip-camera-cctv',
        permanent: true,
      },
      {
        source: "/categories/lpr-license-plate-recognition-camera",
        destination: '/categories/icp-ip-camera-cctv',
        permanent: true,
      },
      {
        source: "/categories/dvr-digital-video-recorders",
        destination: '/categories/dvr-poe-ip-camera-wholesale',
        permanent: true,
      },
    ];
  }

}

module.exports = nextConfig