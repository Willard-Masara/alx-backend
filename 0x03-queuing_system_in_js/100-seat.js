const express = require('express');
const redis = require('redis');
const kue = require('kue');
const { promisify } = require('util');

// Redis client setup
const redisClient = redis.createClient();
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Initialize available seats to 50
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return parseInt(seats) || 0;
}

reserveSeat(50); // Set initial available seats to 50
let reservationEnabled = true; // Initially, reservation is enabled

// Kue queue setup
const queue = kue.createQueue();

// Express server setup
const app = express();
const PORT = 1245;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Routes
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        res.json({ status: "Reservation are blocked" });
        return;
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            res.json({ status: "Reservation failed" });
        } else {
            res.json({ status: "Reservation in process" });
        }
    });
});

app.get('/process', async (req, res) => {
    res.json({ status: "Queue processing" });

    queue.process('reserve_seat', async (job, done) => {
        let currentAvailableSeats = await getCurrentAvailableSeats();
        if (currentAvailableSeats <= 0) {
            reservationEnabled = false;
            done(new Error("Not enough seats available"));
            return;
        }

        currentAvailableSeats--;
        await reserveSeat(currentAvailableSeats);
        if (currentAvailableSeats === 0) {
            reservationEnabled = false;
        }
        
        console.log(`Seat reservation job ${job.id} completed`);
        done();
    });
});

