import kue from 'kue';

const queue = kue.createQueue({ concurrency: 2 });

const blacklistedNumbers = ['4153518780', '4153518781'];

const sendNotification = (phoneNumber, message, job, done) => {
    job.progress(0, 100);

    if (blacklistedNumbers.includes(phoneNumber)) {
        const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
        done(new Error(errorMessage));
    } else {
        job.progress(50, 100);

        console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

        setTimeout(() => {

        done();
        }, 1000);
    }
};

queue.process('push_notification_code_2', (job, done) => {
    const { phoneNumber, message } = job.data;

    sendNotification(phoneNumber, message, job, done);
});

queue.on('job enqueue', (id, type) => {
    console.log(`Job ${id} ${type} queued`);
});

queue.on('job complete', (id) => {
    kue.Job.get(id, (err, job) => {
        if (err) return;
            job.remove();
    });
});
