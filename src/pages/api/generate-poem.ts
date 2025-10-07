import type { NextApiRequest, NextApiResponse } from 'next';
import { PoemGenerationService } from '../../lib/poem-service';

// Global monitoring initialization for Node.js runtime (middleware runs in Edge)
let globalMonitoringInitialized = false;

async function initializeGlobalMonitoring() {
  if (globalMonitoringInitialized) return;

  try {
    console.log('🌐 Initializing Coolhand global monitoring in Node.js runtime...');
    const { initializeGlobalMonitoring } = await import('coolhand-node/auto-monitor');
    await initializeGlobalMonitoring({
      apiKey: process.env.COOLHAND_API_KEY!,
      silent: process.env.NODE_ENV === 'production'
    });
    globalMonitoringInitialized = true;
    console.log('✅ Global monitoring enabled for all AI API calls!');
  } catch (error) {
    console.error('❌ Failed to initialize global monitoring:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Initialize global monitoring on first API call in Node.js runtime
  await initializeGlobalMonitoring();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicApiKey) {
      return res.status(500).json({
        error: 'ANTHROPIC_API_KEY not configured'
      });
    }

    const { theme } = req.body;

    console.log('🎨 API: Starting poem generation...');

    const poemService = new PoemGenerationService(anthropicApiKey);

    let result;
    if (theme && poemService.getAvailableThemes().includes(theme)) {
      console.log(`🎯 API: Generating poem for specific theme: ${theme}`);
      result = await poemService.generatePoemWithTheme(theme);
    } else {
      console.log('🎲 API: Generating poem with random theme');
      result = await poemService.generatePoem();
    }

    console.log('✅ API: Poem generated successfully');

    return res.status(200).json({
      success: true,
      data: {
        theme: result.request.theme,
        poem: result.poem,
        timestamp: result.timestamp,
        availableThemes: poemService.getAvailableThemes()
      }
    });

  } catch (error) {
    console.error('❌ API: Error generating poem:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}