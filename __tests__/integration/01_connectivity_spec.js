const { createClient, hasSteatiteContent, sleep } = require('../helpers/test_utils');
const config = require('../helpers/test_config');

describe('HAProxy->AAAforREST->Steatite Stack Connectivity', () => {
  let client;

  beforeAll(() => {
    client = createClient();
  });

  afterAll(async () => {
    await sleep(30000);
  });

  test('GET / returns 200 OK and Steatite homepage', async () => {
    const response = await client.get('/');

    expect(response.status).toBe(200);
    expect(response.headers['x-powered-by']).toContain('PHP');
    expect(response.data).toContain('Steatite');
    expect(response.data).toContain('Pictures');
  });

  test('GET /picture/ returns 200 OK and picture list', async () => {
    const response = await client.get('/picture/');

    expect(response.status).toBe(200);
    expect(hasSteatiteContent(response)).toBe(true);
  });

  test('GET /stylesheet.css returns CSS content', async () => {
    const response = await client.get('/stylesheet.css');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/css');
  });

  test('Headers are correctly passed through the stack', async () => {
    const response = await client.get('/', {
      headers: {
        'User-Agent': 'IntegrationTest/1.0'
      }
    });

    expect(response.status).toBe(200);
    
    expect(response.headers['server']).toContain('Apache');
  });

  test('Non-existent routes return 404', async () => {
    const response = await client.get('/nonexistent');

    expect(response.status).toBe(404);
  });

  test('Multiple sequential requests all succeed', async () => {
    const requests = 5;
    const responses = [];

    for (let i = 0; i < requests; i++) {
      const response = await client.get('/');
      responses.push(response);
    }

    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});
