import { ApiClient } from '../core/ApiClient';
import { ResponseValidator } from '../core/ResponseValidator';
import { StandardHealthCheckSchema } from '../schemas/HealthCheckSchemas';
import { logger } from '../../utils/logger';

export interface HealthCheckConfig {
  endpoint: string;
  serviceName: string;
  expectedStatus?: number;
  maxSlaMs?: number;
  headers?: Record<string, string>;
}

export class HealthMonitor {
  constructor(private apiClient: ApiClient) {}

  /**
   * Pings a specific health endpoint and performs comprehensive validation.
   */
  public async checkServiceHealth(config: HealthCheckConfig): Promise<boolean> {
    const { 
      endpoint, 
      serviceName, 
      expectedStatus = 200, 
      maxSlaMs = 500,
      headers
    } = config;
    
    logger.info(`Starting health check for service: ${serviceName}`);
    
    try {
      // 1. Make the API request
      const response = await this.apiClient.get(endpoint, {
        headers,
        timeout: 5000,
        retries: 2, // Retry transient failures
      });

      // 2. Validate Status Code
      ResponseValidator.validateStatusCode(response, expectedStatus);
      
      // 3. Validate SLA (Response Time)
      await ResponseValidator.validateResponseTime(response, maxSlaMs);
      
      // 4. Validate Schema
      // Only parse JSON if content-type is json
      const contentType = response.headers()['content-type'];
      if (contentType && contentType.includes('application/json')) {
         await ResponseValidator.validateSchema(response, StandardHealthCheckSchema);
      } else {
         logger.info(`Skipping schema validation for non-JSON response from ${serviceName}`);
      }
      
      logger.info(`✅ Health check PASSED for service: ${serviceName}`);
      return true;
      
    } catch (error: any) {
      logger.error(`❌ Health check FAILED for service: ${serviceName}. Reason: ${error.message}`);
      return false;
    }
  }

  /**
   * Check multiple services in parallel.
   */
  public async checkMultipleServices(configs: HealthCheckConfig[]): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    const promises = configs.map(async (config) => {
      const isHealthy = await this.checkServiceHealth(config);
      results.set(config.serviceName, isHealthy);
    });

    await Promise.allSettled(promises);
    return results;
  }
}
