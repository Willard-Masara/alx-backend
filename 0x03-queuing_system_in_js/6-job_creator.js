// Import the required library
import kue from 'kue';

// Create a queue with Kue
const queue = kue.createQueue();

// Define the job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a test message',
};

// Create a job in the push_notification_code queue
const job = queue.create('push_notification_code', jobData);

// When the job is created without error
job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

// When the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
});

// When the job fails
job.on('failed', () => {
  console.log('Notification job failed');
});

// Save the job to the queue
job.save((err) => {
  if (err) {
    console.error(`Error creating notification job: ${err}`);
  }
});

