import { z } from 'zod';

/**
 * Standard health check response schema based on common enterprise conventions.
 */
export const StandardHealthCheckSchema = z.object({
  status: z.union([z.literal('ok'), z.literal('UP'), z.literal('healthy')]).optional(),
  uptime: z.number().optional(),
  version: z.string().optional(),
  timestamp: z.string().datetime().optional()
}).passthrough(); // allows other fields as well
