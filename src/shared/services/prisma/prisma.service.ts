import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from 'src/generated/prisma/client';
import envConfig from 'src/shared/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const rawUrl = envConfig.DIRECT_DATABASE_URL || envConfig.DATABASE_URL;

    const connectionString = PrismaService.resolveConnectionUrl(rawUrl);

    if (!connectionString) {
      throw new Error('Database connection URL is not defined in environment variables.');
    }

    const pool = new Pool({
      connectionString,
      max: envConfig.DB_POOL_MAX,
      min: envConfig.DB_POOL_MIN,
      connectionTimeoutMillis: envConfig.DB_TIMEOUT_MS,
      ssl: envConfig.DB_SSL_ENABLED ? { rejectUnauthorized: false } : false,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }

  /**
   * Giải quyết và chuẩn hóa chuỗi kết nối Database:
   *
   * 1. Trường hợp thông thường: URL có dạng `postgresql://` hoặc `postgres://` (Docker, Supabase, Neon, AWS RDS, v.v.)
   *    -> Trả về nguyên bản để `pg.Pool` kết nối trực tiếp.
   *
   * 2. Trường hợp đặc biệt: URL có dạng `prisma+postgres://` (do lệnh `npx prisma dev` hoặc Prisma Cloud sinh ra).
   *    -> Prisma CLI mã hóa connection string TCP gốc vào tham số query `api_key` dưới dạng Base64 JSON:
   *       { "databaseUrl": "postgres://postgres:...@localhost:51214/template1", ... }
   *    -> Hàm này sẽ giải mã Base64 để lấy `databaseUrl` thực thụ, giúp `pg.Pool` và `@prisma/adapter-pg`
   *       kết nối được qua TCP socket mà không bị lỗi giao thức không hợp lệ.
   */
  private static resolveConnectionUrl(urlStr?: string): string | undefined {
    if (!urlStr) return undefined;

    // Kiểm tra xem URL có phải là định dạng riêng của Prisma Dev / Accelerate hay không
    if (urlStr.startsWith('prisma+postgres:')) {
      try {
        const parsedUrl = new URL(urlStr);
        const apiKey = parsedUrl.searchParams.get('api_key');

        if (apiKey) {
          // Giải mã Base64 -> Chuỗi JSON chứa thông tin connection string gốc
          const jsonPayload = Buffer.from(apiKey, 'base64').toString('utf-8');
          const decoded = JSON.parse(jsonPayload) as { databaseUrl?: string };

          if (typeof decoded.databaseUrl === 'string') {
            return decoded.databaseUrl;
          }
        }
      } catch {
        // Nếu parse thất bại, fallback trả về URL ban đầu để tránh crash app
      }
    }

    // Trả về chuỗi kết nối chuẩn (postgresql://, postgres://, ...)
    return urlStr;
  }
}
