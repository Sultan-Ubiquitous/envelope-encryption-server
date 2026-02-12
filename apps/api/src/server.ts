import { createApp } from './app.js';
import { env } from './config/env.js';
import { StorageFactory } from './storage/storage.factory.js';

/**
 * Start the server
 */
async function start() {
  try {
    const app = await createApp();

    // Start listening
    await app.listen({
      port: parseInt(env.PORT, 10),
      host: env.HOST,
    });

    console.log(`
🚀 Server ready at http://${env.HOST}:${env.PORT}
📦 Storage: ${env.STORAGE_TYPE}
🔐 Encryption: AES-256-GCM with envelope encryption
🌍 Environment: ${env.NODE_ENV}
    `);

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      await app.close();
      await StorageFactory.disconnect();
      console.log('✅ Shutdown complete');
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();