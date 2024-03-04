import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Event listener for successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Event listener for connection error
client.on('error', (error) => {
    console.error(`Redis client not connected to the server: ${error}`);
});

// Close the connection when the script is terminated
process.on('SIGINT', () => {
    client.quit();
});
