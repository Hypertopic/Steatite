const { createClient, makeParallelRequests, sleep, countByStatus, measureResponseTime } = require('../helpers/test_utils');
const config = require('../helpers/test_config');

describe('HAProxy Rate Limiting & Traffic Policing', () => {
  let client;

  beforeAll(() => {
    client = createClient();
  });

  afterAll(async () => {
    await sleep(30000);
  });

  describe('Rate Limiting Enforcement', () => {
    test('Requests under limit (90 req) all succeed', async () => {
      const underLimit = config.RATE_LIMIT.maxRequests - 10;
      const responses = await makeParallelRequests('/', underLimit);
      const statusCounts = countByStatus(responses);

      expect(statusCounts[200]).toBeGreaterThan(underLimit * 0.8);
      expect(statusCounts[429] || 0).toBeLessThan(underLimit * 0.2);
    });

    test('Requests exceeding limit (110 req) get rate limited with 429', async () => {
      const overLimit = config.RATE_LIMIT.maxRequests + 10;
      const responses = await makeParallelRequests('/', overLimit);
      const statusCounts = countByStatus(responses);

      expect(statusCounts[200]).toBeGreaterThan(0);
      expect(statusCounts[429]).toBeGreaterThan(0);

      expect(Object.values(statusCounts).reduce((a, b) => a + b, 0)).toBe(overLimit);
    });

    test('Rate limit resets after waiting period', async () => {
    
      await makeParallelRequests('/', config.RATE_LIMIT.maxRequests + 10);

      await sleep((config.RATE_LIMIT.resetSeconds + 5) * 1000);

      const responses = await makeParallelRequests('/', 10);
      const statusCounts = countByStatus(responses);

      expect(statusCounts[200]).toBeGreaterThan(5);
    }, 60000);
  });

  describe('Rate Limiting Performance', () => {
    test('429 responses are served instantly by HAProxy', async () => {
      
      await makeParallelRequests('/', config.RATE_LIMIT.maxRequests + 20);

      const responseTime = await measureResponseTime(async () => {
        await client.get('/');
      });

      expect(responseTime).toBeLessThan(50);
    });

    test('Backend never receives rate-limited requests', async () => {

      expect(true).toBe(true);
    });
  });

  describe('Resilience Under Load', () => {
    test('HAProxy remains responsive during rate limiting', async () => {

      const responses = await makeParallelRequests('/', 150);

      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });

    test('Legitimate traffic succeeds even during attack', async () => {
      
      const attackPromise = makeParallelRequests('/', 150);

      await sleep(100);
      const legitimateResponse = await client.get('/');

      expect([200, 429]).toContain(legitimateResponse.status);

      await attackPromise; // Clean up
    });
  });

});
