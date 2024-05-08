const kue = require('kue');
const queue = kue.createQueue();
const redisConfig = {
    redis: {
        port: 6379, // default Redis port
        host: 'localhost', // default Redis host
    },
};

// Create a function named sendNotification
function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Queue process to listen to new jobs on push_notification_code
queue.process('push_notification_code', redisConfig, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done();
});

