/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// Initialize global Coolhand monitoring at application startup (Node.js runtime)
async function initializeGlobalMonitoring() {
  try {
    if (process.env.COOLHAND_API_KEY) {
      console.log('🌐 Initializing Coolhand global monitoring from next.config.js...');
      const { initializeGlobalMonitoring } = await import('coolhand-node/auto-monitor');
      await initializeGlobalMonitoring({
        apiKey: process.env.COOLHAND_API_KEY,
        silent: process.env.NODE_ENV === 'production'
      });
      console.log('✅ Global monitoring enabled for all AI API calls!');
    }
  } catch (error) {
    console.error('❌ Failed to initialize global monitoring:', error);
  }
}

// Initialize monitoring when config loads
initializeGlobalMonitoring();

/** @type {import("next").NextConfig} */
const config = {};

export default config;
