import { expect, APIResponse } from '@playwright/test';
import { ZodSchema } from 'zod';
import { logger } from '../../utils/logger';

export class ResponseValidator {
  
  /**
   * Validates the HTTP status code of the response.
   */
  public static validateStatusCode(response: APIResponse, expectedStatus: number | number[]): void {
    const status = response.status();
    const url = response.url();
    
    if (Array.isArray(expectedStatus)) {
      expect(expectedStatus, `Expected status of ${url} to be one of ${expectedStatus.join(', ')} but got ${status}`)
        .toContain(status);
    } else {
      expect(status, `Expected status of ${url} to be ${expectedStatus} but got ${status}`).toBe(expectedStatus);
    }
    
    logger.info(`✅ Status code ${status} is valid.`);
  }

  /**
   * Validates the SLA (Service Level Agreement) for response time.
   */
  public static async validateResponseTime(response: APIResponse, maxResponseTimeMs: number): Promise<void> {
    const executionTime = (response as any).__executionTime;
    const url = response.url();
    
    if (executionTime === undefined) {
      logger.warn(`Execution time was not tracked for ${url}. Skipping SLA validation.`);
      return;
    }

    expect(executionTime, `Expected response time for ${url} to be less than ${maxResponseTimeMs}ms but was ${executionTime}ms`)
      .toBeLessThan(maxResponseTimeMs);
      
    logger.info(`✅ Response time ${executionTime}ms is within SLA of ${maxResponseTimeMs}ms.`);
  }

  /**
   * Validates the response body against a Zod schema.
   */
  public static async validateSchema<T>(response: APIResponse, schema: ZodSchema<T>): Promise<T> {
    const jsonBody = await response.json();
    const result = schema.safeParse(jsonBody);
    const url = response.url();

    if (!result.success) {
      logger.error(`Schema validation failed for ${url}: ${result.error.message}`);
      // Fail the test using expect to integrate with Playwright's reporting
      expect(result.success, `Schema validation failed for ${url}: \n${JSON.stringify(result.error.format(), null, 2)}`).toBe(true);
      throw new Error('Schema validation failed'); // Should theoretically not reach here if expect fails
    }

    logger.info(`✅ Schema validation passed for ${url}.`);
    return result.data;
  }
  
  /**
   * Validates that specific headers exist in the response and match expected values.
   */
  public static validateHeaders(response: APIResponse, expectedHeaders: Record<string, string | RegExp>): void {
    const actualHeaders = response.headers();
    
    for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
      const lowerHeader = header.toLowerCase();
      expect(actualHeaders, `Expected header ${header} to be present`).toHaveProperty(lowerHeader);
      
      const actualValue = actualHeaders[lowerHeader];
      if (expectedValue instanceof RegExp) {
        expect(actualValue, `Expected header ${header} to match ${expectedValue}`).toMatch(expectedValue);
      } else {
        expect(actualValue, `Expected header ${header} to be ${expectedValue}`).toBe(expectedValue);
      }
    }
    
    logger.info(`✅ Headers validated successfully.`);
  }
}
