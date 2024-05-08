function createPushNotificationsJobs(jobs, queue) {
    // Check if jobs is an array
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    // Iterate through each job in the jobs array
    jobs.forEach((jobData) => {
        // Create a job in the queue push_notification_code_3
        const job = queue.create('push_notification_code_3', jobData);

        // When a job is created, log to the console
        job.on('enqueue', () => {
            console.log(`Notification job created: ${job.id}`);
        });

        // When a job is complete, log to the console
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        // When a job is failed, log to the console
        job.on('failed', (errorMessage) => {
            console.log(`Notification job ${job.id} failed: ${errorMessage}`);
        });

        // When a job is making progress, log to the console
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });

        // Save the job to the queue
        job.save();
    });
}

module.exports = { createPushNotificationsJobs };

