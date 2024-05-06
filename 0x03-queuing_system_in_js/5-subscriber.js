import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(`Redis client not connected to server:${error}`);
});

client.subscribe('holberton_school_channel', (err) => {
  if (err) {
    console.error(`Error subscribing to channel: ${err}`);
    return;
  }
});

client.on('message', (channel, message) => {
  // line below must be removed son
  //console.log(`Recieved message from channel ${channel}`);

  if (message === 'KILL_SERVER') {
    client.unsubscribe(channel, (err) => {
      if (err) {
        console.error(`Error unsubscribing from channel: ${err}`);
        return;
      }
      console.log(`${message}`);
      client.quit();
    });
  } else {
    console.log(`${message}`);
  }
});