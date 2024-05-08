import kue from 'kue';
import redis from 'redis';
import express from 'express';
const { promisify } = require('util');

//const express = require('express');

const app = express();
const client = redis.createClient();
const queue = kue.createQueue();

client.on('error', function (err) {
  console.log(`Redis client not connected to server: ${err}`);
});

// initialize
let avaliableSeats = 50;
let reservationEnabled = true;

// promisify
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// functions
async function reserveSeat(number){
  if (reservationEnabled) {
    try {
      await setAsync(`available_seats`, number);
    } catch (error) {
      console.log('Error reserving seat:', error);
    }
  }
}

async function getCurrentAvailableSeats() {
  try {
    const avaliableSeats = await getAsync('available_seats');
    return avaliableSeats;
  } catch (error) {
    console.log('Error getting available seats:', error);
  }
}

// routes
app.get('/available_seats', async (req, res) => {
  try {
    const seats = await getCurrentAvailableSeats();
    res.json({ numbeOfAvaliableSeats: seats });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

app.get('/reserve_seat', async (req, res) => {
  if (reservationEnabled === false) {
    res.json({ status: 'Reservation are blocked' });
  } else {
    let job = queue.create('reserve_seat', {}).save((err) => {
      if (err) {
        console.log(`Job failed: ${err}`);
        res.json({ status: 'Reservation failed' });
      } else {
        console.log(`Seat reservation job ${job.id} saved`);
        res.json({ status: 'Reservation in process' });
      }
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
      }).on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
      });
  }
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      let seats = await getCurrentAvailableSeats();
      if (seats > 0) {
        await reserveSeat(--seats);
        if (seats === 0) {
          reservationEnabled = false;
        }
        done();
      } else {
        done(new Error('Not enough seats available'));
      }
    } catch (error) {
      done(error);
    }
  });
});

// endpoints
reserveSeat(avaliableSeats);
app.port = 1245;
app.listen(app.port, () => {
  console.log(`Server is running on port ${app.port}`);
});
