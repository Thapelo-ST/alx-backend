import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const port = 1245;

const redisClient = redis.createClient();
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

const queue = kue.createQueue();

const reserveSeat = async (number) => {
    await hsetAsync('available_seats', 'numberOfAvailableSeats', number);
};

const getCurrentAvailableSeats = async () => {
    const result = await hgetAsync('available_seats', 'numberOfAvailableSeats');
    return parseInt(result, 10) || 0;
};

reserveSeat(50);

let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: `${numberOfAvailableSeats}` });
});

app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }

        return res.json({ status: 'Reservation in process' });
    });
});

app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const currentAvailableSeats = await getCurrentAvailableSeats();

        if (currentAvailableSeats <= 0) {
            done(new Error('Not enough seats available'));
        } else {
            await reserveSeat(currentAvailableSeats - 1);

        if (currentAvailableSeats === 1) {
            reservationEnabled = false;
        }

            console.log(`Seat reservation job ${job.id} completed`);
            done();
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
