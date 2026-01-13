module.exports = {
  // Test target: HAProxy entry point
  HAPROXY_URL: process.env.HAPROXY_URL || 'http://localhost:8888',

  // Direct access URLs for verification
  AAAFORREST_URL: process.env.AAAFORREST_URL || 'http://localhost:1337',

  // Test credentials (must exist in CouchDB)
  TEST_USER: {
    username: 'test',
    password: 'test'
  },

  // Invalid credentials for negative tests
  INVALID_USER: {
    username: 'invalid',
    password: 'wrong'
  },

  // Rate limiting configuration (must match HAProxy config)
  RATE_LIMIT: {
    maxRequests: 100,
    windowSeconds: 10,
    resetSeconds: 30
  },

  // Test corpus name
  TEST_CORPUS: 'TestIntegration'
};
