import nextPWA from "next-pwa";

/** STEP 1: configure PWA */
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true, // 👈 IMPORTANT
  buildExcludes: [/app-build-manifest\.json$/],
});

/** STEP 2: normal Next config */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

/** STEP 3: wrap */
export default withPWA(nextConfig);
