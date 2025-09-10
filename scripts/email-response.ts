import { EmailResponseService } from '../src/lib/email-service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const coolhandApiKey = process.env.COOLHAND_API_KEY;
  const coolhandEnvironment = (process.env.COOLHAND_ENVIRONMENT as 'local' | 'production') || 'production';

  if (!openAIApiKey) {
    console.error('❌ OPENAI_API_KEY is required');
    process.exit(1);
  }

  if (!coolhandApiKey) {
    console.error('❌ COOLHAND_API_KEY is required');
    process.exit(1);
  }

  console.log('🚀 Starting Email Response Generator...');
  console.log(`📧 Using Coolhand environment: ${coolhandEnvironment}`);
  console.log();

  try {
    const emailService = new EmailResponseService(
      openAIApiKey,
      coolhandApiKey,
      coolhandEnvironment
    );

    // Get the example customer email
    const customerEmail = emailService.getExampleCustomerEmail();
    
    console.log('📨 Processing customer email...');
    console.log('=' .repeat(50));
    console.log('Original Email:');
    console.log(`From: ${customerEmail.from}`);
    console.log(`Subject: ${customerEmail.subject}`);
    console.log(`Body:\n${customerEmail.body}`);
    console.log('=' .repeat(50));
    console.log();

    // Generate the response
    console.log('🤖 Generating response using LangChain and OpenAI...');
    const result = await emailService.generateEmailResponse(customerEmail);

    console.log('✅ Response generated successfully!');
    console.log('=' .repeat(50));
    console.log('Generated Response:');
    console.log(result.response);
    console.log('=' .repeat(50));
    console.log();
    console.log(`📅 Generated at: ${result.timestamp.toISOString()}`);

  } catch (error) {
    console.error('❌ Error generating email response:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);