import dotenv from 'dotenv';
import { PoemGenerationService } from '../src/lib/poem-service';

// Load environment variables FIRST
dotenv.config();

async function main() {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicApiKey) {
    console.error('❌ ANTHROPIC_API_KEY is required');
    console.error('   Please set it in your .env file');
    process.exit(1);
  }

  console.log('🎭 Starting Poem Generation Service...');
  console.log('🌐 Using global auto-monitor (no explicit initialization needed)');
  console.log();

  try {
    const poemService = new PoemGenerationService(
      anthropicApiKey
    );

    // Show available themes
    const themes = poemService.getAvailableThemes();
    console.log('🎨 Available themes:');
    themes.forEach((theme, index) => {
      console.log(`   ${index + 1}. ${theme}`);
    });
    console.log();

    // Generate a poem with random theme
    console.log('🎲 Generating poem with randomly selected theme...');
    console.log('='.repeat(60));

    const result = await poemService.generatePoem();

    console.log('✨ Poem generated successfully!');
    console.log('='.repeat(60));
    console.log(`🎯 Selected Theme: ${result.request.theme}`);
    console.log(`📅 Generated at: ${result.timestamp.toISOString()}`);
    console.log();
    console.log('📝 Generated Poem:');
    console.log('='.repeat(60));
    console.log(result.poem);
    console.log('='.repeat(60));
    console.log();

    console.log('🌐 API call monitored by global Coolhand auto-monitor');

    console.log();
    console.log('🔄 Want to generate another poem? Run this script again!');

  } catch (error) {
    console.error('❌ Error generating poem:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);