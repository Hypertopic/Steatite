const { createClient, createAuthenticatedClient, uploadFile, sleep } = require('../helpers/test_utils');
const config = require('../helpers/test_config');

describe('Authentication & Authorization through Full Stack', () => {
  let client;
  let authClient;

  beforeAll(() => {
    client = createClient();
    authClient = createAuthenticatedClient(
      config.TEST_USER.username,
      config.TEST_USER.password
    );
    invalidAuthClient = createAuthenticatedClient(
      config.INVALID_USER.username,
      config.INVALID_USER.password
    );
  });

  afterAll(async () => {
    await sleep(30000);
  });

  describe('Public Read Access', () => {
    test('Unauthenticated GET requests succeed', async () => {
      const response = await client.get('/');
      expect(response.status).toBe(200);
    });

    test('Unauthenticated GET /picture/ succeeds', async () => {
      const response = await client.get('/picture/');
      expect(response.status).toBe(200);
    });
  });

  describe('Protected Write Operations', () => {
    test('Unauthenticated POST returns 401', async () => {
      const response = await client.post(`/picture/?corpus=${config.TEST_CORPUS}`, {
        test: 'data'
      });

      expect(response.status).toBe(401);
    });

    test('Authenticated POST with valid credentials succeeds', async () => {
      const response = await uploadFile(
        null,
        'test_auth.txt',
        config.TEST_CORPUS,
        config.TEST_USER
      );

      expect([200, 201]).toContain(response.status);
    });

    test('Authenticated POST with invalid credentials fails', async () => {
      const response = await uploadFile(
        null,
        'test_invalid.txt',
        config.TEST_CORPUS,
        config.INVALID_USER
      );

      expect(response.status).toBe(401);
    });
  });

  describe('Session Management', () => {
    test('GET /_session without auth returns ok:true', async () => {
      const response = await client.get('/_session');

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('ok', true);
      expect(response.data).not.toHaveProperty('name');
    });

    test('GET /_session with Basic Auth validates credentials', async () => {
      const response = await authClient.get('/_session');

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('ok', true);
    });

    test('Session creation with valid credentials', async () => {
      const response = await client.post('/_session', {
        name: config.TEST_USER.username,
        password: config.TEST_USER.password
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('name', config.TEST_USER.username);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    test('Session creation with invalid credentials fails', async () => {
      const response = await client.post('/_session', {
        name: config.INVALID_USER.username,
        password: config.INVALID_USER.password
      });

      expect(response.status).toBe(401);
    });
  });

  describe('CORS Headers', () => {
    test('Responses include CORS headers', async () => {
      const response = await client.get('/_session');

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
