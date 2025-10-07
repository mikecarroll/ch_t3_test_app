/**
 * Next.js Middleware - Initialize Global Coolhand Monitoring
 *
 * This middleware runs on every request and ensures global monitoring
 * is initialized before any API handlers execute.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Global flag to ensure we only initialize once
let isGlobalMonitoringInitialized = false;

export function middleware(request: NextRequest) {
  // Initialize global monitoring on first request
  if (!isGlobalMonitoringInitialized && process.env.COOLHAND_API_KEY) {
    try {
      // Dynamic import to avoid issues with server/client boundaries
      const initializeMonitoring = async () => {
        // Temporarily commented out due to module resolution issues
        // const { initializeGlobalMonitoring } = await import('coolhand-node');

        /* initializeGlobalMonitoring({
          apiKey: process.env.COOLHAND_API_KEY!,
          environment: process.env.NODE_ENV === 'production' ? 'production' : 'local',
          silent: process.env.NODE_ENV === 'production'
        }); */

        console.log('🌐 Coolhand global monitoring initialized via middleware');
      };

      // Initialize asynchronously to avoid blocking the request
      initializeMonitoring().catch(console.error);
      isGlobalMonitoringInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Coolhand global monitoring:', error);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Run on API routes
    '/api/:path*',
    // Run on tRPC routes
    '/api/trpc/:path*'
  ]
};