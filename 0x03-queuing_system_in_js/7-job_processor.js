const kue = require('kue');
const queue = kue.createQueue();
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a function sendNotification
function sendNotification(phoneNumber, message, job, done) {
    // Track the progress of the job
    job.progress(0, 100);

    // If phoneNumber is blacklisted, fail the job
    if (blacklistedNumbers.includes(phoneNumber)) {
        const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
        return done(new Error(errorMessage));
    }

    // Otherwise, track the progress to 50%
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Complete the job
    done();
}

// Create a queue with Kue to process jobs from push_notification_code_2
queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});

