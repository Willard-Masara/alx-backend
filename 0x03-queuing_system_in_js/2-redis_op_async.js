// Import the required library
import redis from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = redis.createClient();

// Promisify the get function of the Redis client
const getAsync = promisify(client.get).bind(client);

// Handle connection events
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a new school value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Value set for ${schoolName}: ${reply}`);
    }
  });
}

// Function to display the value for a school in Redis using async/await
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName);
    if (value === null) {
      console.log(`No value found for ${schoolName}`);
    } else {
      console.log(`Value for ${schoolName}: ${value}`);
    }
  } catch (error) {
    console.error(`Error getting value for ${schoolName}: ${error.message}`);
  }
}

// Call the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

