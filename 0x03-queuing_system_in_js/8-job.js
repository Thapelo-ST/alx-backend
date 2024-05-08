import redis from 'redis';

const client = redis.createClient();

client.on('error', function (err) {
  console.log(`Redis client not connected to server: ${err}`);
});

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    const err = new Error(`Jobs is not an array`);
  }

  jobs.forEach((job) => {
    const newJob = queue.create('push_notification_code_3', job).save(function (err) {
      if (!err) console.log(`Notification job created: ${newJob.id}`);
    });

    newJob.on('complete', () => {
      console.log(`Notification job ${newJob.id} completed`);
    });

    newJob.on('failed', (err) => {
      console.log(`Notification job ${newJob.id} failed: ${err}`);
    });

    newJob.on('progress', (progress) => {
      console.log(`Notification job ${newJob.id} ${progress}% complete`);
    });
  });
}

module.exports = createPushNotificationsJobs;