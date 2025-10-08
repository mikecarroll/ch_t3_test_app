/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// Initialize global monitoring as middleware - this will monitor ALL HTTP requests
if (process.env.COOLHAND_API_KEY) {
  // Import auto-monitor to enable automatic global monitoring
  import('coolhand-node/auto-monitor');
}

/** @type {import("next").NextConfig} */
const config = {};

export default config;
