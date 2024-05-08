const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Data access
const getItemById = (id) => {
    return listProducts.find(item => item.itemId === id);
};

// Server
app.listen(1245, () => {
    console.log('Server is running on port 1245');
});

// Products
app.get('/list_products', (req, res) => {
    res.json(listProducts.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.price,
        initialAvailableQuantity: item.initialAvailableQuantity
    })));
});

// In stock in Redis
const reserveStockById = async (itemId, stock) => {
    await setAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock) : 0;
};

// Product detail
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: 'Product not found' });
        return;
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({ ...item, currentQuantity });
});

// Reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: 'Product not found' });
        return;
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    if (currentQuantity >= item.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
    }
    await reserveStockById(itemId, currentQuantity + 1);
    res.json({ status: 'Reservation confirmed', itemId });
});

