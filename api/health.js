export default function handler(req, res) {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY
    ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + "..."
    : "NOT_SET";

  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    vercelEnv: process.env.VERCEL_ENV,
    hasAnthropicKey,
    keyPrefix,
    debug: {
      allEnvKeysWithAnthropicOrVite: Object.keys(process.env).filter(key =>
        key.includes('ANTHROPIC') || key.includes('VITE')
      ),
    }
  });
}
