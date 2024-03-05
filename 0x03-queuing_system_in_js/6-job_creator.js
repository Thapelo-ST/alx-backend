import kue from 'kue';

const queue = kue.createQueue();

const jobData = {
    phoneNumber: '123456789',
    message: 'Hello, this is a notification message!',
};

const notificationJob = queue
    .create('push_notification_code', jobData)
    .save((err) => {
        if (!err) {
        console.log(`Notification job created: ${notificationJob.id}`);
        } else {
        console.error(`Error creating notification job: ${err}`);
        }
    });

notificationJob.on('complete', () => {
    console.log('Notification job completed');
});

notificationJob.on('failed', (errorMessage) => {
    console.error(`Notification job failed: ${errorMessage}`);
});
