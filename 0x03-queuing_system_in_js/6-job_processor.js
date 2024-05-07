import kue from 'kue';
import redis from 'redis'


const client = redis.createClient();
const queue = kue.createQueue();

client.on('error', function(err) {
  console.log(`Redis client not connected to server: ${err}`);
});

function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

queue.process("push_notification_code", function(job, done){
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

