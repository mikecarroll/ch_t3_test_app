// src/app/email/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function EmailResponsePage() {
  const [customEmail, setCustomEmail] = useState({
    from: "",
    subject: "",
    body: "",
  });

  const utils = api.useUtils();
  
  // Get example email query
  const { data: exampleEmail } = api.email.getExampleEmail.useQuery();
  
  // Mutation for example email response
  const generateExampleResponse = api.email.generateExampleResponse.useMutation({
    onSuccess: () => {
      void utils.email.invalidate();
    },
  });

  // Mutation for custom email response
  const generateCustomResponse = api.email.generateResponse.useMutation({
    onSuccess: () => {
      void utils.email.invalidate();
    },
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.from && customEmail.subject && customEmail.body) {
      generateCustomResponse.mutate(customEmail);
    }
  };

  const loadExampleEmail = () => {
    if (exampleEmail) {
      setCustomEmail({
        from: exampleEmail.from,
        subject: exampleEmail.subject,
        body: exampleEmail.body,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-center">
          Email Response Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Example Email Section */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Example Email</h2>
            
            {exampleEmail && (
              <div className="mb-4 space-y-2">
                <p><strong>From:</strong> {exampleEmail.from}</p>
                <p><strong>Subject:</strong> {exampleEmail.subject}</p>
                <div>
                  <strong>Body:</strong>
                  <pre className="mt-2 whitespace-pre-wrap text-sm bg-white/5 p-3 rounded">
                    {exampleEmail.body}
                  </pre>
                </div>
              </div>
            )}

            <button
              onClick={() => generateExampleResponse.mutate()}
              disabled={generateExampleResponse.isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700 disabled:opacity-50"
            >
              {generateExampleResponse.isPending 
                ? "Generating Response..." 
                : "Generate Response for Example Email"
              }
            </button>

            {generateExampleResponse.data && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Generated Response:</h3>
                <div className="bg-white/5 p-4 rounded">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generateExampleResponse.data.response}
                  </pre>
                </div>
              </div>
            )}

            {generateExampleResponse.error && (
              <div className="mt-4 p-4 bg-red-500/20 rounded">
                <p className="text-red-300">
                  Error: {generateExampleResponse.error.message}
                </p>
              </div>
            )}
          </div>

          {/* Custom Email Section */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Custom Email</h2>
            
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium mb-1">
                  From Email:
                </label>
                <input
                  id="from"
                  type="email"
                  value={customEmail.from}
                  onChange={(e) => setCustomEmail(prev => ({
                    ...prev,
                    from: e.target.value
                  }))}
                  className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-gray-300"
                  placeholder="customer@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject:
                </label>
                <input
                  id="subject"
                  type="text"
                  value={customEmail.subject}
                  onChange={(e) => setCustomEmail(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))}
                  className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-gray-300"
                  placeholder="Issue with my order"
                  required
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium mb-1">
                  Email Body:
                </label>
                <textarea
                  id="body"
                  value={customEmail.body}
                  onChange={(e) => setCustomEmail(prev => ({
                    ...prev,
                    body: e.target.value
                  }))}
                  className="w-full h-32 rounded-lg bg-white/10 px-3 py-2 text-white placeholder-gray-300 resize-none"
                  placeholder="Enter the customer's email content here..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={generateCustomResponse.isPending}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold transition hover:bg-green-700 disabled:opacity-50"
                >
                  {generateCustomResponse.isPending 
                    ? "Generating..." 
                    : "Generate Response"
                  }
                </button>
                
                <button
                  type="button"
                  onClick={loadExampleEmail}
                  className="rounded-lg bg-gray-600 px-4 py-2 font-semibold transition hover:bg-gray-700"
                >
                  Load Example
                </button>
              </div>
            </form>

            {generateCustomResponse.data && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Generated Response:</h3>
                <div className="bg-white/5 p-4 rounded">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generateCustomResponse.data.response}
                  </pre>
                </div>
              </div>
            )}

            {generateCustomResponse.error && (
              <div className="mt-4 p-4 bg-red-500/20 rounded">
                <p className="text-red-300">
                  Error: {generateCustomResponse.error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}