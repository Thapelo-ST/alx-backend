import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Sample product data
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const redisClient = redis.createClient();
const hgetAsync = promisify(redisClient.hget).bind(redisClient);

const getItemById = (id) => {
    return listProducts.find((product) => product.itemId === id);
};

const reserveStockById = (itemId, stock) => {
    redisClient.hset(`item:${itemId}`, 'stock', stock);
};

// Async function to get the current reserved stock by item id
const getCurrentReservedStockById = async (itemId) => {
    const currentQuantity = await hgetAsync(`item:${itemId}`, 'stock') || 0;
    return parseInt(currentQuantity, 10);
};

app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const item = getItemById(itemId);

    if (!item) {
        return res.json({ status: 'Product not found' });
    }

    const currentQuantity = await getCurrentReservedStockById(itemId);
    const result = { ...item, currentQuantity };
    res.json(result);
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const item = getItemById(itemId);

    if (!item) {
        return res.json({ status: 'Product not found' });
    }

    const currentQuantity = await getCurrentReservedStockById(itemId);

    if (currentQuantity === item.initialAvailableQuantity) {
        return res.json({ status: 'Not enough stock available', itemId });
    }

    reserveStockById(itemId, currentQuantity + 1);
    return res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
