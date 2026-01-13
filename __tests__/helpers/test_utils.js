const axios = require('axios');
const FormData = require('form-data');
const config = require('./test_config');

/**
 * Create an axios instance with base configuration
 */
function createClient(baseURL = config.HAPROXY_URL) {
  return axios.create({
    baseURL,
    validateStatus: () => true, // Don't throw on any status code
    maxRedirects: 0
  });
}

/**
 * Create authenticated axios instance with Basic Auth
 */
function createAuthenticatedClient(username, password, baseURL = config.HAPROXY_URL) {
  return axios.create({
    baseURL,
    auth: { username, password },
    validateStatus: () => true,
    maxRedirects: 0
  });
}

/**
 * Make multiple requests in parallel
 */
async function makeParallelRequests(url, count, options = {}) {
  const client = options.auth
    ? createAuthenticatedClient(options.auth.username, options.auth.password)
    : createClient();

  const promises = Array(count).fill(null).map(() =>
    client.get(url, { headers: options.headers || {} })
  );

  return Promise.all(promises);
}

/**
 * Make sequential requests with delay
 */
async function makeSequentialRequests(url, count, delayMs = 0, options = {}) {
  const client = options.auth
    ? createAuthenticatedClient(options.auth.username, options.auth.password)
    : createClient();

  const results = [];

  for (let i = 0; i < count; i++) {
    const response = await client.get(url, { headers: options.headers || {} });
    results.push(response);
    if (delayMs > 0 && i < count - 1) {
      await sleep(delayMs);
    }
  }

  return results;
}

/**
 * Upload a file with multipart/form-data
 */
async function uploadFile(filepath, filename, corpus, credentials) {
  const form = new FormData();
  form.append('file', Buffer.from('test file content'), {
    filename: filename,
    contentType: 'text/plain'
  });

  const client = createAuthenticatedClient(credentials.username, credentials.password);

  return client.post(`/picture/?corpus=${corpus}`, form, {
    headers: form.getHeaders()
  });
}

/**
 * Wait for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Count responses by status code
 */
function countByStatus(responses) {
  return responses.reduce((acc, res) => {
    acc[res.status] = (acc[res.status] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Check if response contains expected content
 */
function hasSteatiteContent(response) {
  return response.data &&
         (response.data.includes('Steatite') ||
          response.data.includes('Pictures') ||
          typeof response.data === 'object');
}

/**
 * Measure response time
 */
async function measureResponseTime(requestFn) {
  const start = Date.now();
  await requestFn();
  return Date.now() - start;
}

module.exports = {
  createClient,
  createAuthenticatedClient,
  makeParallelRequests,
  makeSequentialRequests,
  uploadFile,
  sleep,
  countByStatus,
  hasSteatiteContent,
  measureResponseTime
};
