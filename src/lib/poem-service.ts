// src/lib/poem-service.ts
import Anthropic from '@anthropic-ai/sdk';

export interface PoemRequest {
  theme: string;
  timestamp: Date;
}

export interface PoemResponse {
  request: PoemRequest;
  poem: string;
  timestamp: Date;
  feedbackResult?: any;
}

export class PoemGenerationService {
  private anthropic: Anthropic;
  private themes: string[] = [
    'mushrooms',
    'prison escape movies',
    'Hegel',
    'Kobo Abe',
    'Green Tea Leaf Salad'
  ];

  constructor(
    anthropicApiKey: string
  ) {
    // Initialize Anthropic Claude (no Coolhand - relying on global monitor)
    this.anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });
  }

  private selectRandomTheme(): string {
    const randomIndex = Math.floor(Math.random() * this.themes.length);
    return this.themes[randomIndex];
  }

  async generatePoem(): Promise<PoemResponse> {
    try {
      // Select a random theme
      const selectedTheme = this.selectRandomTheme();
      const poemRequest: PoemRequest = {
        theme: selectedTheme,
        timestamp: new Date()
      };

      console.log(`🎨 Generating poem about: ${selectedTheme}`);

      // Create the prompt for Claude
      const prompt = this.createPrompt(selectedTheme);

      // Generate poem using Claude (cheapest model)
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const poem = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        request: poemRequest,
        poem: poem,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating poem:', error);
      throw new Error(`Failed to generate poem: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createPrompt(theme: string): string {
    const prompts = {
      'mushrooms': `Write a beautiful and evocative poem about mushrooms. Consider their mysterious nature, their role in the forest ecosystem, their diverse forms and colors, and perhaps their connection to both life and decay. Make it vivid and atmospheric.`,

      'prison escape movies': `Write a thrilling poem inspired by prison escape movies. Capture the tension, the planning, the hope for freedom, the camaraderie between inmates, and the dramatic moments of the escape. Think of classics like "The Shawshank Redemption" or "The Great Escape."`,

      'Hegel': `Write a philosophical poem inspired by Georg Wilhelm Friedrich Hegel's ideas. You might explore themes of dialectics, the master-slave relationship, the absolute spirit, historical progression, or the unity of opposites. Make complex philosophy accessible through poetic language.`,

      'Kobo Abe': `Write a surreal and existential poem in the style inspired by Japanese author Kobo Abe. Consider themes of identity, alienation, metamorphosis, urban isolation, and the absurd. Think of works like "The Woman in the Dunes" or "The Face of Another."`,

      'Green Tea Leaf Salad': `Write a fresh and vibrant poem about green tea leaf salad. Explore the textures, flavors, the cultural significance of tea, the transformation from drink to food, and perhaps the meditative aspects of both preparing and eating it.`
    };

    return prompts[theme as keyof typeof prompts] || `Write a beautiful poem about ${theme}.`;
  }


  // Get all available themes
  getAvailableThemes(): string[] {
    return [...this.themes];
  }

  // Generate poem with specific theme (for testing)
  async generatePoemWithTheme(theme: string): Promise<PoemResponse> {
    if (!this.themes.includes(theme)) {
      throw new Error(`Theme "${theme}" is not available. Available themes: ${this.themes.join(', ')}`);
    }

    try {
      const poemRequest: PoemRequest = {
        theme: theme,
        timestamp: new Date()
      };

      console.log(`🎨 Generating poem about: ${theme}`);

      const prompt = this.createPrompt(theme);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const poem = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        request: poemRequest,
        poem: poem,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating poem:', error);
      throw new Error(`Failed to generate poem: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}