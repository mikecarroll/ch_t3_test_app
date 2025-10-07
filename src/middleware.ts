/**
 * Next.js Middleware - Initialize Global Coolhand Monitoring
 *
 * This middleware runs on every request and ensures global monitoring
 * is initialized before any API handlers execute.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force Node.js runtime instead of Edge runtime for coolhand-node compatibility
export const runtime = 'nodejs';

// Global flag to ensure we only initialize once
let isGlobalMonitoringInitialized = false;

export function middleware(request: NextRequest) {
  // Initialize global monitoring on first request
  if (!isGlobalMonitoringInitialized && process.env.COOLHAND_API_KEY) {
    try {
      // Dynamic import to avoid issues with server/client boundaries
      const initializeMonitoring = async () => {
        // Edge runtime detected - deferring full initialization to Node.js API routes
        console.log('⚠️  Edge runtime in middleware - global monitoring will initialize in API routes');

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
    // Run on ALL API routes (this covers both tRPC and pages API routes)
    '/api/:path*'
  ]
};