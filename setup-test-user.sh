#!/bin/bash
# Setup script for test user in CouchDB

echo "Creating test user in CouchDB..."

# Wait for CouchDB to be ready
sleep 5

# Create test user
curl -X PUT http://admin:admin@localhost:5984/_users/org.couchdb.user:test \
     -H "Content-Type: application/json" \
     -d '{"name":"test","password":"test","roles":[],"type":"user"}'

echo ""
echo "Test user 'test' created successfully!"
echo "You can now run: npm test"
