const chai = require('chai');
const sinon = require('sinon');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let jobs;
  let queue;

  beforeEach(() => {
    jobs = [
      { title: 'Job 1', message: 'Message 1' },
      { title: 'Job 2', message: 'Message 2' },
    ];
    queue = {
      create: sinon.stub().returnsThis(),
      save: sinon.stub(),
    };
  });

  it('should create push notification jobs for each job in the array', () => {
    createPushNotificationsJobs(jobs, queue);

    chai.expect(queue.create.callCount).to.equal(jobs.length);
    chai.expect(queue.save.callCount).to.equal(jobs.length);
  });

  it('should log the notification job ID when a job is successfully created', () => {
    const consoleLogStub = sinon.stub(console, 'log');

    createPushNotificationsJobs(jobs, queue);

    chai.expect(consoleLogStub.callCount).to.equal(jobs.length);
    chai.expect(consoleLogStub.getCall(0).args[0]).to.match(/Notification job created: .+/);

    consoleLogStub.restore();
  });

  it('should log the notification job ID when a job is completed', () => {
    const consoleLogStub = sinon.stub(console, 'log');
    const job = {
      id: 'job-id',
      on: sinon.stub(),
    };
    queue.create.returns(job);

    createPushNotificationsJobs(jobs, queue);

    job.on.withArgs('complete').callsArg(1);

    chai.expect(consoleLogStub.callCount).to.equal(jobs.length);
    chai.expect(consoleLogStub.getCall(0).args[0]).to.match(/Notification job .+ completed/);

    consoleLogStub.restore();
  });

  it('should log the notification job ID and error message when a job fails', () => {
    const consoleLogStub = sinon.stub(console, 'log');
    const job = {
      id: 'job-id',
      on: sinon.stub(),
    };
    queue.create.returns(job);
    const error = new Error('Job failed');
    const errorMessage = `Notification job ${job.id} failed: ${error}`;

    createPushNotificationsJobs(jobs, queue);

    job.on.withArgs('failed').callsArgWith(1, error);

    chai.expect(consoleLogStub.callCount).to.equal(jobs.length);
    chai.expect(consoleLogStub.getCall(0).args[0]).to.equal(errorMessage);

    consoleLogStub.restore();
  });

  it('should log the notification job ID and progress percentage when a job makes progress', () => {
    const consoleLogStub = sinon.stub(console, 'log');
    const job = {
      id: 'job-id',
      on: sinon.stub(),
    };
    queue.create.returns(job);
    const progress = 50;
    const progressMessage = `Notification job ${job.id} ${progress}% complete`;

    createPushNotificationsJobs(jobs, queue);

    job.on.withArgs('progress').callsArgWith(1, progress);

    chai.expect(consoleLogStub.callCount).to.equal(jobs.length);
    chai.expect(consoleLogStub.getCall(0).args[0]).to.equal(progressMessage);

    consoleLogStub.restore();
  });

  it('should throw an error if jobs is not an array', () => {
    const invalidJobs = 'not an array';

    chai.expect(() => createPushNotificationsJobs(invalidJobs, queue)).to.throw(TypeError, 'Jobs is not an array');
  });
});
