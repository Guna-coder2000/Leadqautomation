import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../api/core/ApiClient';
import { allure } from 'allure-playwright';

test.describe('Enterprise API Negative Scenarios (404 and 500 Errors)', () => {
  let apiClient: ApiClient;
  let context: any;

  test.beforeAll(async () => {
    context = await request.newContext();
    apiClient = new ApiClient(context);
  });

  test.afterAll(async () => {
    if (context) {
      await context.dispose();
    }
  });

  test('TC-API-001 Verify API correctly handles 404 Not Found errors', async () => {
    allure.story('Error Handling');
    allure.severity('normal');
    allure.description('Verify the system returns a proper 404 status when accessing a non-existent endpoint.');

    await test.step('Step 1: Send GET request to a non-existent endpoint', async () => {
      // Using a known 404 endpoint for demonstration
      const response = await context.get('https://jsonplaceholder.typicode.com/invalid-endpoint-that-does-not-exist');
      
      await test.step('Step 2: Verify the response status code is exactly 404', async () => {
        expect(response.status()).toBe(404);
      });
    });
  });

  test('TC-API-002 Verify API correctly handles 500 Internal Server errors', async () => {
    allure.story('Error Handling');
    allure.severity('critical');
    allure.description('Verify the system gracefully handles internal server errors without crashing.');

    await test.step('Step 1: Send request to an endpoint that triggers a server error', async () => {
      // Using dummyjson.com for robust mock status codes that don't timeout
      const response = await context.get('https://dummyjson.com/http/500');
      
      await test.step('Step 2: Verify the response status code indicates a server error (5xx)', async () => {
        expect(response.status()).toBeGreaterThanOrEqual(500);       
        expect(response.status()).toBeLessThan(600);       
      });
    });
  });
});
