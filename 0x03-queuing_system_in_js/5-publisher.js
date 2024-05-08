// Import the required library
import redis from 'redis';

// Create a Redis client
const publisher = redis.createClient();

// Handle connection events
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

publisher.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to publish a message after a specified time
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
}

// Call publishMessage function
publishMessage('Hello, Holberton!', 1000);
publishMessage('KILL_SERVER', 2000);

