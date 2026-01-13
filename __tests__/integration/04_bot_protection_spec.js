const { createClient, makeParallelRequests, sleep } = require('../helpers/test_utils');
const config = require('../helpers/test_config');

describe('Bot Protection & Traffic Filtering', () => {
  let client;

  beforeAll(() => {
    client = createClient();
  });

  afterAll(async () => {
    await sleep(30000);
  });

  describe('Legitimate User Agents', () => {
    test('Browser user agents are allowed', async () => {
      const response = await client.get('/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      expect(response.status).toBe(200);
    });

    test('Chrome user agent is allowed', async () => {
      const response = await client.get('/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
        }
      });

      expect(response.status).toBe(200);
    });

    test('Firefox user agent is allowed', async () => {
      const response = await client.get('/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:120.0) Gecko/20100101 Firefox/120.0'
        }
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Rate Limiting as Bot Protection', () => {
    test('Rapid automated requests are throttled', async () => {

      const botRequests = 120;
      const responses = await makeParallelRequests('/', botRequests, {
        headers: {
          'User-Agent': 'AutomatedBot/1.0'
        }
      });

      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    test('Scrapers exceeding rate limit are blocked', async () => {
      const responses = await makeParallelRequests('/', 110, {
        headers: {
          'User-Agent': 'ScraperBot/1.0'
        }
      });

      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(5);
    });
  });

  describe('Attack Simulation', () => {
    test('Backend remains functional during bot attack', async () => {

      const attackPromise = makeParallelRequests('/', 200, {
        headers: { 'User-Agent': 'AttackBot/1.0' }
      });

      await sleep(200);

      const legitimateResponse = await client.get('/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'
        }
      });

      expect([200, 429]).toContain(legitimateResponse.status);

      await attackPromise;

      await sleep(30000);
    }, 60000);

    test('Multiple concurrent bot requests are handled', async () => {
      const responses = await makeParallelRequests('/', 150);

      expect(responses.length).toBe(150);
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });

      await sleep(30000);
    }, 60000);
  });

  describe('Resource Protection', () => {
    test('Thumbnail requests are whitelisted from rate limiting', async () => {

      const responses = await makeParallelRequests('/thumbnail/test', 110);

      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBe(0);
    });

    test('Optimized image requests are protected', async () => {
      const responses = await makeParallelRequests('/optimized/test', 110);

      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Protection Effectiveness', () => {
    test('Rate limiting prevents resource exhaustion', async () => {

      const responses = await makeParallelRequests('/', 200);

      const blocked = responses.filter(r => r.status === 429);
      expect(blocked.length).toBeGreaterThan(50);

      expect(responses.length).toBe(200);
    });
  });
});
