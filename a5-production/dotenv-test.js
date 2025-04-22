// Simple test to verify dotenv is working
const fs = require('fs');
const path = require('path');

console.log("Current directory:", process.cwd());
console.log(".env file exists:", fs.existsSync(path.join(process.cwd(), '.env')));

if (fs.existsSync(path.join(process.cwd(), '.env'))) {
  console.log("Contents of .env file:");
  console.log(fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8'));
}

// Now test dotenv
require('dotenv').config();
console.log("Environment variables after loading dotenv:");
console.log("MONGODB:", process.env.MONGODB);
console.log("PGDATABASE:", process.env.PGDATABASE);