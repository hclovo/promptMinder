import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  POSTGRES_URL: z.string().url(),
  DATABASE_URL: z.string().url().optional(),
  API_PORT: z.coerce.number().default(3000),
  ENABLE_ANALYTICS: z.coerce.boolean().default(false)
});

export type EnvConfig = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_URL: process.env.POSTGRES_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  API_PORT: process.env.API_PORT,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS
});