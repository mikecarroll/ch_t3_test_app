import { useState } from 'react';
import Head from 'next/head';

interface PoemData {
  theme: string;
  poem: string;
  timestamp: string;
  availableThemes: string[];
}

interface PoemResponse {
  success: boolean;
  data?: PoemData;
  error?: string;
}

export default function PoemsPage() {
  const [poem, setPoem] = useState<PoemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const themes = [
    'mushrooms',
    'prison escape movies',
    'Hegel',
    'Kobo Abe',
    'Green Tea Leaf Salad'
  ];

  const generatePoem = async (theme?: string) => {
    setLoading(true);
    setError(null);
    setPoem(null);

    try {
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      const data: PoemResponse = await response.json();

      if (data.success && data.data) {
        setPoem(data.data);
      } else {
        setError(data.error || 'Failed to generate poem');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPoem = () => {
    generatePoem();
  };

  const handleThemePoem = () => {
    if (selectedTheme) {
      generatePoem(selectedTheme);
    }
  };

  return (
    <>
      <Head>
        <title>AI Poem Generator - Global Monitoring Demo</title>
        <meta name="description" content="Generate poems using Claude AI with Coolhand global monitoring" />
      </Head>

      <main className="container mx-auto min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              AI <span className="text-[hsl(280,100%,70%)]">Poem</span> Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Generate beautiful poems using Claude AI with global Coolhand monitoring
            </p>
            <div className="mt-2 text-sm text-yellow-300">
              🌐 All AI API calls are automatically monitored by Coolhand global monitoring
            </div>
          </div>

          {/* Controls */}
          <div className="mb-8 rounded-xl bg-white/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Random Poem Button */}
              <div className="flex-1">
                <button
                  onClick={handleRandomPoem}
                  disabled={loading}
                  className="w-full rounded-lg bg-purple-600 px-6 py-3 text-white font-medium transition-all hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {loading ? '🎨 Generating...' : '🎲 Generate Random Poem'}
                </button>
              </div>

              {/* Theme Selection */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Or choose a specific theme:
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="flex-1 rounded-lg bg-white/20 px-3 py-2 text-white border border-white/30"
                    disabled={loading}
                  >
                    <option value="">Select theme...</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme} className="text-black">
                        {theme}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleThemePoem}
                    disabled={loading || !selectedTheme}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium transition-all hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
              <p className="mt-4 text-white">Claude is crafting your poem...</p>
              <p className="mt-2 text-sm text-yellow-300">
                📡 Watch the server logs to see Coolhand monitoring in action!
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4 mb-6">
              <p className="text-red-200">❌ Error: {error}</p>
            </div>
          )}

          {/* Poem Display */}
          {poem && !loading && (
            <div className="rounded-xl bg-white/10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  🎯 Theme: <span className="text-purple-300">{poem.theme}</span>
                </h2>
                <div className="text-sm text-gray-400">
                  {new Date(poem.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="rounded-lg bg-black/30 p-6">
                <pre className="whitespace-pre-wrap text-gray-100 font-mono leading-relaxed">
                  {poem.poem}
                </pre>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-green-300">
                  ✅ Generated successfully using Claude 3 Haiku
                </p>
                <p className="text-xs text-yellow-300 mt-1">
                  🌐 This API call was automatically logged by Coolhand global monitoring
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 rounded-xl bg-blue-500/20 border border-blue-500/50 p-6">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">
              🔍 Global Monitoring Demo
            </h3>
            <ul className="text-sm text-blue-100 space-y-2">
              <li>• This T3 app has Coolhand global monitoring enabled</li>
              <li>• When you generate a poem, it calls the Claude API via our backend</li>
              <li>• The global monitor automatically intercepts and logs the API call</li>
              <li>• Check your server console to see the monitoring in action!</li>
              <li>• No explicit Coolhand initialization needed in the poem service</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}