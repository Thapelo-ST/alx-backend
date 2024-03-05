import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from '@babel/cli'

// Create a Kue queue in test mode
const queue = kue.createQueue({ testMode: true });

describe('createPushNotificationsJobs', () => {
    beforeEach(() => {
        queue.testMode.clear();
    });

    after(() => {
        queue.testMode.exit();
    });

    it('should create jobs for valid phone numbers', () => {
        const validJobs = [
            { phoneNumber: '4153518782', message: 'Valid message 1' },
            { phoneNumber: '4153518783', message: 'Valid message 2' },
        ];

        createPushNotificationsJobs(queue, validJobs);

        expect(queue.testMode.jobs.length).to.equal(validJobs.length);

        validJobs.forEach((jobData, index) => {
            const job = queue.testMode.jobs[index];
            expect(job.data).to.deep.equal(jobData);
            expect(job.type).to.equal('push_notification_code_2');
        });
    });

    it('should not create jobs for blacklisted phone numbers', () => {
        const blacklistedJobs = [
            { phoneNumber: '4153518780', message: 'Blacklisted message 1' },
            { phoneNumber: '4153518781', message: 'Blacklisted message 2' },
        ];

        createPushNotificationsJobs(queue, blacklistedJobs);

        expect(queue.testMode.jobs.length).to.equal(0);
    });
});
