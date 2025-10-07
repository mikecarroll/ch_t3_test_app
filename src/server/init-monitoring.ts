/**
 * Global Coolhand Monitoring Initialization
 *
 * This module initializes global monitoring for the entire application.
 * Import this at the top of your server entry points to enable automatic
 * AI API logging for all services.
 */

// import { initializeGlobalMonitoring } from 'coolhand-node/auto-monitor'; // Temporarily commented out

let isInitialized = false;

export function initializeCoolhandMonitoring() {
  if (isInitialized) {
    return;
  }

  const apiKey = process.env.COOLHAND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  COOLHAND_API_KEY not found - AI API calls will not be logged');
    }
    return;
  }

  try {
    // Temporarily commented out due to module resolution issues
    /* initializeGlobalMonitoring({
      apiKey,
      silent: process.env.NODE_ENV === 'production'
    }); */

    isInitialized = true;

    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 Coolhand global monitoring initialized for T3 app (temporarily disabled)');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Coolhand monitoring:', error);
  }
}

// Auto-initialize when this module is imported
initializeCoolhandMonitoring();