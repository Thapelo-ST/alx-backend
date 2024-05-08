import kue from 'kue';
import redis from 'redis';
import express from 'express';

//const express = require('express');

const app = express();
const client = redis.createClient();
const queue = kue.createQueue();

client.on('error', function (err) {
  console.log(`Redis client not connected to server: ${err}`);
});

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    stock: 5,
  }
];

// Functions

function getItemById(id) {
  return listProducts.find(product => product.itemId === id);
}

function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock, (err, reply) => {
    if (err) {
      console.log(`Error setting stock for item ${itemId}: ${err}`);
    }
  });
}

async function getCurrentReservedStockById(itemId) {
  return new Promise((resolve, reject) => {
    client.get(`item.${itemId}`, (err, reply) => {
      if (err) reject(err);
      resolve(reply ? parseInt(reply) : 0);
    });
  });
}

// Routes

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const id = req.params.itemId;
  const product = listProducts[id - 1];
  if (product){
    const currentQuantity = await getCurrentReservedStockById(id);
    //product.currentQuantity = currentQuantity;
    product.currentQuantity = product.stock;
    res.json(product);
  } else {
    res.json({ status: 'Product not found '});
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const id = req.params.itemId;
  const product = listProducts[id - 1];
  if (!product) {
    res.json({ status: 'Product not found ' });
    return;
  }

  const currentQuantity = await getCurrentReservedStockById(id);

  product.currentQuantity = product.stock;
  if (product.currentQuantity <= 0) {
    res.json({ status: 'Not enough stock avaliable', itemId: id });
    return;
  }

  reserveStockById(id, currentQuantity - 1);
  res.json({ status: 'Reservation confirmed', itemId: id });
});

// End points

app.port = 1245;
app.listen(app.port, () => {
  console.log(`Server is running on port ${app.port}`);
});
