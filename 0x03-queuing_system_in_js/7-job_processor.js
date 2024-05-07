import kue from "kue";
import redis from "redis";

const client = redis.createClient();

client.on("error", function (err) {
  console.log(`Redis client not connected to server: ${err}`);
});

const blacklistedJobs = [ "4153518780", "4153518781" ];

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);
  if (blacklistedJobs.includes(phoneNumber)) {
    const err = new Error(`Phone number ${phoneNumber} is blacklisted`);
    job.failed().error(err);
    done(err);
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
}

const pushNotificationQueue = kue.createQueue();

pushNotificationQueue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
