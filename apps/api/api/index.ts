// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app.js';

// Initialize app once for reuse across invocations (cold start optimization)
let app: Awaited<ReturnType<typeof createApp>> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Reuse existing app instance if available
    if (!app) {
      app = await createApp();
      await app.ready();
    }

    // Pass the request to Fastify
    app.server.emit('request', req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to process request' 
    });
  }
}