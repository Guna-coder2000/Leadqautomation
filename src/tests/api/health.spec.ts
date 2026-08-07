import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../api/core/ApiClient';
import { HealthMonitor, HealthCheckConfig } from '../../api/health/HealthMonitor';
import { getEnvConfig } from '../../utils/env';

// We can define our services to monitor here
const servicesToMonitor: HealthCheckConfig[] = [
  {
    serviceName: 'JSON Placeholder Users API',
    endpoint: 'https://jsonplaceholder.typicode.com/users/1', // A real endpoint for demo purposes
    expectedStatus: 200,
    maxSlaMs: 1000 // Liberal SLA for public API
  },
  {
    serviceName: 'JSON Placeholder Posts API',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    expectedStatus: 200,
    maxSlaMs: 1000
  },
  // In a real scenario, you'd pull base URL from environment:
  // {
  //   serviceName: 'Core Backend Service',
  //   endpoint: `${getEnvConfig().baseURL}/health`,
  //   expectedStatus: 200,
  //   maxSlaMs: 500
  // }
];

test.describe('Enterprise API Health Checks', () => {

  let apiClient: ApiClient;
  let healthMonitor: HealthMonitor;
  let context: any; // APIRequestContext

  test.beforeAll(async () => {
    // Manually create APIRequestContext to reuse across tests
    context = await request.newContext();
    apiClient = new ApiClient(context);
    healthMonitor = new HealthMonitor(apiClient);
  });

  test.afterAll(async () => {
    if (context) {
      await context.dispose();
    }
  });

  for (const service of servicesToMonitor) {
    test(`Health Check for ${service.serviceName}`, async () => {
      // Execute the comprehensive health check
      const isHealthy = await healthMonitor.checkServiceHealth(service);
      
      // The test passes if the service is healthy
      // The HealthMonitor internally handles assertions on Status, SLA, and Schema
      expect(isHealthy, `${service.serviceName} is not healthy`).toBeTruthy();
    });
  }

  test('Check all services concurrently', async () => {
    // Alternatively, you can run all checks in parallel for a massive speedup
    const results = await healthMonitor.checkMultipleServices(servicesToMonitor);
    
    // Check if any service failed
    for (const [serviceName, isHealthy] of results.entries()) {
      expect(isHealthy, `Parallel check: ${serviceName} is down`).toBeTruthy();
    }
  });

});