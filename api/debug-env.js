// Debug endpoint to check if environment variables are available
// Remove this file after debugging!

export default function handler(req, res) {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY
    ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + "..."
    : "NOT SET";

  res.status(200).json({
    hasAnthropicKey,
    keyPrefix, // Shows first 10 chars to verify it's there
    allEnvKeys: Object.keys(process.env).filter(key =>
      key.includes('ANTHROPIC') || key.includes('VITE')
    ),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
