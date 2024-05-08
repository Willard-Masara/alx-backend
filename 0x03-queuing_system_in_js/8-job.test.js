const kue = require('kue');
const { createPushNotificationsJobs } = require('./8-job');
// Create a queue with Kue
const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
    beforeEach(() => {
        // Enter test mode without processing the jobs
        queue.testMode.enter();
    });

    afterEach(() => {
        // Clear the queue and exit test mode
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => {
            createPushNotificationsJobs({}, queue);
        }).toThrowError('Jobs is not an array');
    });

    it('should create jobs in the queue and log appropriate messages', () => {
        // Define test jobs
        const jobs = [
            { phoneNumber: '123', message: 'Test message 1' },
            { phoneNumber: '456', message: 'Test message 2' }
        ];

        // Call the function to create jobs
        createPushNotificationsJobs(jobs, queue);

        // Check if jobs are added to the queue and log appropriate messages
        expect(queue.testMode.jobs.length).toBe(2);
        expect(queue.testMode.jobs[0].type).toBe('push_notification_code_3');
        expect(queue.testMode.jobs[1].type).toBe('push_notification_code_3');
        expect(console.log).toHaveBeenCalledWith('Notification job created: ' + queue.testMode.jobs[0].id);
        expect(console.log).toHaveBeenCalledWith('Notification job created: ' + queue.testMode.jobs[1].id);
    });

    it('should handle empty jobs array', () => {
        // Call the function with an empty jobs array
        createPushNotificationsJobs([], queue);

        // Check if no jobs are added to the queue
        expect(queue.testMode.jobs.length).toBe(0);
    });

    it('should create jobs with correct job data', () => {
        // Define test jobs
        const jobs = [
            { phoneNumber: '123', message: 'Test message 1' },
            { phoneNumber: '456', message: 'Test message 2' }
        ];

        // Call the function to create jobs
        createPushNotificationsJobs(jobs, queue);

        // Check if job data matches the input
        expect(queue.testMode.jobs[0].data).toEqual(jobs[0]);
        expect(queue.testMode.jobs[1].data).toEqual(jobs[1]);
    });

    it('should log error if job creation fails', () => {
        // Mocking a failure in job creation
        queue.create = jest.fn().mockImplementation(() => { throw new Error('Error creating job'); });

        // Define test jobs
        const jobs = [
            { phoneNumber: '123', message: 'Test message 1' },
            { phoneNumber: '456', message: 'Test message 2' }
        ];

        // Call the function to create jobs
        createPushNotificationsJobs(jobs, queue);

        // Check if error is logged
        expect(console.error).toHaveBeenCalledWith('Error creating job', expect.any(Error));
    });
});

