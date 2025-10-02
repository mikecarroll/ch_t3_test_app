// src/server/api/routers/email.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EmailResponseService } from "~/lib/email-service";
import { env } from "~/env";

// Validation schema for customer email
const customerEmailSchema = z.object({
  from: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const emailRouter = createTRPCRouter({
  // Generate response for a custom email
  generateResponse: publicProcedure
    .input(customerEmailSchema)
    .mutation(async ({ input }) => {
      const emailService = new EmailResponseService(
        env.OPENAI_API_KEY,
        env.COOLHAND_API_KEY,
        env.COOLHAND_SILENT === 'true'
      );

      const response = await emailService.generateEmailResponse(input);
      return response;
    }),

  // Generate response for the example email
  generateExampleResponse: publicProcedure
    .mutation(async () => {
      const emailService = new EmailResponseService(
        env.OPENAI_API_KEY,
        env.COOLHAND_API_KEY,
        env.COOLHAND_SILENT === 'true'
      );

      const exampleEmail = emailService.getExampleCustomerEmail();
      const response = await emailService.generateEmailResponse(exampleEmail);
      return response;
    }),

  // Get the example customer email without generating a response
  getExampleEmail: publicProcedure
    .query(() => {
      const emailService = new EmailResponseService('', '', true); // No keys needed for this, silent mode
      return emailService.getExampleCustomerEmail();
    }),
});