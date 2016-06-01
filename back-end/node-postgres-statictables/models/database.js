var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'pg://postgres:postgres@localhost:5432/RealState';
var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE users(id SERIAL, name TEXT, email TEXT)');
query.on('end', function() { client.end(); });
