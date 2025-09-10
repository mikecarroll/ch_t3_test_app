// src/lib/email-service.ts
import { Coolhand } from 'coolhand-node';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

export interface CustomerEmail {
  from: string;
  subject: string;
  body: string;
}

export interface EmailResponse {
  original: CustomerEmail;
  response: string;
  timestamp: Date;
}

export class EmailResponseService {
  private coolhand: Coolhand;
  private model: ChatOpenAI;
  private promptTemplate: PromptTemplate;

  constructor(
    openAIApiKey: string,
    coolhandApiKey: string,
    environment: 'local' | 'production' = 'production'
  ) {
    // Initialize Coolhand
    this.coolhand = new Coolhand({
      environment,
      apiKey: coolhandApiKey,
      silent: false
    });

    // Initialize OpenAI model
    this.model = new ChatOpenAI({
      apiKey: openAIApiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    // Create prompt template
    this.promptTemplate = new PromptTemplate({
      template: `You are a helpful customer service representative. Please write a professional and empathetic response to the following customer email.

Customer Email:
From: {from}
Subject: {subject}
Body: {body}

Instructions:
- Be professional and empathetic
- Acknowledge their issue and apologize for the inconvenience
- Provide a clear solution or next steps
- Thank them for their loyalty if mentioned
- Keep the tone friendly but professional

Response:`,
      inputVariables: ["from", "subject", "body"],
    });
  }

  async generateEmailResponse(customerEmail: CustomerEmail): Promise<EmailResponse> {
    try {
      // Format the prompt with customer email data
      const formattedPrompt = await this.promptTemplate.format({
        from: customerEmail.from,
        subject: customerEmail.subject,
        body: customerEmail.body,
      });

      // Generate response using the model
      const result = await this.model.invoke(formattedPrompt);
      
      return {
        original: customerEmail,
        response: result.content as string,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating email response:', error);
      throw new Error(`Failed to generate email response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Example method to get hardcoded customer email for testing
  getExampleCustomerEmail(): CustomerEmail {
    return {
      from: "john.doe@example.com",
      subject: "Issue with Recent Order #12345",
      body: `Hi there,

I received my order #12345 yesterday, but I'm having some issues with the product. The item appears to be damaged during shipping - there's a crack on the side and it's not working properly.

I've been a loyal customer for 3 years and this is the first time I've had this issue. Could you please help me resolve this? I would prefer a replacement if possible.

Thank you for your time.

Best regards,
John Doe`
    };
  }
}