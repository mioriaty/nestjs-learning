import 'dotenv/config';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, validateSync } from 'class-validator';

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Environment file not found');
  process.exit(1);
}

class ConfigSchema {
  @Type(() => Number)
  @IsNumber()
  PORT: number = 3000;

  @IsString()
  DATABASE_URL: string = '';

  @IsString()
  DIRECT_DATABASE_URL: string = '';

  @IsString()
  ACCESS_TOKEN_SECRET: string = '';

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string = '';

  @IsString()
  REFRESH_TOKEN_SECRET: string = '';

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string = '';

  @Type(() => Number)
  @IsNumber()
  DB_POOL_MAX: number = 10;

  @Type(() => Number)
  @IsNumber()
  DB_POOL_MIN: number = 2;

  @Type(() => Number)
  @IsNumber()
  DB_TIMEOUT_MS: number = 10000;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  DB_SSL_ENABLED: boolean = false;
}

const envConfig = plainToInstance(ConfigSchema, process.env);

const errors = validateSync(envConfig);

if (errors.length > 0) {
  throw errors.map(({ property, constraints, value }) => ({ property, constraints, value }));
}

export default envConfig;
