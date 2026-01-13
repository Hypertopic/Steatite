const { createClient, createAuthenticatedClient, makeParallelRequests, sleep, measureResponseTime } = require('../helpers/test_utils');
const config = require('../helpers/test_config');

describe('Load & Resilience Testing', () => {
  let client;
  let authClient;

  beforeAll(() => {
    client = createClient();
    authClient = createAuthenticatedClient(
      config.TEST_USER.username,
      config.TEST_USER.password
    );
  });

  describe('Concurrent User Handling', () => {
    test('10 parallel legitimate users all get responses', async () => {
      const responses = await makeParallelRequests('/', 10);

      expect(responses.length).toBe(10);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('20 parallel requests complete without errors', async () => {
      const responses = await makeParallelRequests('/picture/', 20);

      expect(responses.length).toBe(20);
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Response Time Under Load', () => {
    test('Response times remain acceptable under moderate load', async () => {
      const responseTimes = [];

      for (let i = 0; i < 10; i++) {
        const time = await measureResponseTime(() => client.get('/'));
        responseTimes.push(time);
      }

      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      expect(avgResponseTime).toBeLessThan(500);
    });

    test('Rate-limited responses are faster than successful ones', async () => {

      await makeParallelRequests('/', config.RATE_LIMIT.maxRequests + 10);

      const rateLimitedTime = await measureResponseTime(() => client.get('/'));

      expect(rateLimitedTime).toBeLessThan(50);
    });
  });

  describe('Backend Health Under Load', () => {
    test('Services remain responsive after heavy load', async () => {

      await makeParallelRequests('/', 150);

      await sleep(1000);

      const response = await client.get('/');
      expect([200, 429]).toContain(response.status);

      await sleep(30000);
    }, 60000);

    test('Authentication still works after load test', async () => {

      await makeParallelRequests('/', 100);

      const response = await authClient.get('/_session');
      expect([200, 429]).toContain(response.status);
      if (response.status === 200) {
        expect(response.data.name).toBe(config.TEST_USER.username);
      }

      await sleep(30000);
    }, 60000);
  });

  describe('Mixed Traffic Scenarios', () => {
    test('Mix of authenticated and unauthenticated requests', async () => {
      const unauthPromises = makeParallelRequests('/', 25);
      const authPromises = Array(5).fill(null).map(() =>
        authClient.get('/_session')
      );

      const allResponses = await Promise.all([...await unauthPromises, ...await authPromises]);

      expect(allResponses.length).toBe(30);

      allResponses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });

    test('Mix of different endpoints under load', async () => {
      const endpoints = ['/', '/picture/', '/_session', '/stylesheet.css'];
      const promises = [];

      for (let i = 0; i < 50; i++) {
        const endpoint = endpoints[i % endpoints.length];
        promises.push(client.get(endpoint));
      }

      const responses = await Promise.all(promises);

      expect(responses.length).toBe(50);

      responses.forEach(response => {
        expect([200, 404, 429]).toContain(response.status);
      });
    });
  });

  describe('Recovery & Stability', () => {
    test('System recovers after rate limit period expires', async () => {

      await makeParallelRequests('/', 120);

      await sleep((config.RATE_LIMIT.resetSeconds + 2) * 1000);

      const responses = await makeParallelRequests('/', 10);
      const successCount = responses.filter(r => r.status === 200).length;

      expect(successCount).toBeGreaterThan(7);
    }, 60000);

    test('Repeated load cycles maintain stability', async () => {
      for (let cycle = 0; cycle < 3; cycle++) {

        const responses = await makeParallelRequests('/', 50);

        expect(responses.length).toBe(50);

        await sleep((config.RATE_LIMIT.resetSeconds + 1) * 1000);
      }

      const finalResponse = await client.get('/');
      expect([200, 429]).toContain(finalResponse.status);
    }, 120000);
  });

  describe('Error Handling', () => {
    test('Invalid URLs handled gracefully', async () => {
      const response = await client.get('/invalid/path/that/does/not/exist');

      expect([404, 400]).toContain(response.status);
    });

    test('Malformed requests handled without crashing', async () => {

      const response = await client.get('/' + 'a'.repeat(100));

      expect([200, 404, 414, 429]).toContain(response.status);
    });
  });
});
