import { PrismaClient } from '@prisma/client';
import type { ITransactionStorage } from './storage.interface.js';
import { MemoryStorage } from './memory.storage.js';
import { PrismaStorage } from './prisma.storage.js';
import { env } from '../config/env.js';

/**
 * Factory for creating storage instances based on configuration
 */
export class StorageFactory {
  private static prismaInstance: PrismaClient | null = null;

  /**
   * Create a storage instance based on STORAGE_TYPE environment variable
   */
  static create(): ITransactionStorage {
    const storageType = env.STORAGE_TYPE;

    switch (storageType) {
      case 'memory':
        console.log('📦 Using in-memory storage');
        return new MemoryStorage();

      case 'prisma':
        console.log('📦 Using Prisma (PostgreSQL) storage');
        return new PrismaStorage(this.getPrismaClient());

      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }
  }

  /**
   * Get or create Prisma client singleton
   */
  private static getPrismaClient(): PrismaClient {
    if (!this.prismaInstance) {
      this.prismaInstance = new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return this.prismaInstance;
  }

  /**
   * Disconnect Prisma client (call on shutdown)
   */
  static async disconnect(): Promise<void> {
    if (this.prismaInstance) {
      await this.prismaInstance.$disconnect();
      this.prismaInstance = null;
    }
  }
}