import kue from 'kue';

const queue = kue.createQueue();

const sendNotification = (phoneNumber, message) => {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;

    sendNotification(phoneNumber, message);

    done();
});

queue.on('job enqueue', (id, type) => {
    console.log(`Job ${id} ${type} queued`);
});

queue.on('job complete', (id) => {
    kue.Job.get(id, (err, job) => {
        if (err) return;
            job.remove((err) => {
        if (err) throw err;
            console.log(`Job ${id} removed from queue`);
        });
    });
});
