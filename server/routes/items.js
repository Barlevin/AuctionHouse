var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the JSON data file
const dataPath = path.join(__dirname, '../data.json');

// Ensure data file exists; create if missing
function ensureDataFile() {
  try {
    if (!fs.existsSync(dataPath)) {
      const initial = { items: [] };
      fs.writeFileSync(dataPath, JSON.stringify(initial, null, 2), 'utf8');
      // eslint-disable-next-line no-console
      console.log(`[items] Created missing data file at: ${dataPath}`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[items] Failed to ensure data file exists:', err);
  }
}

// Helper function to read data
const readData = () => {
  try {
    ensureDataFile();
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[items] Failed to read data file:', error);
    return { items: [] };
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`[items] Persisted ${data.items?.length || 0} items to: ${dataPath}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[items] Failed to write data file:', err);
    throw err;
  }
};

// GET /api/items - Get all auction items
router.get('/items', function(req, res, next) {
  try {
    const data = readData();
    res.json(data.items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read items' });
  }
});

// POST /api/items - Add new auction item
router.post('/items', function(req, res, next) {
  try {
    const { name, description, category, price, priceUnit, sellerDiscord, userId, base, rarity, level, quality, class: itemClass } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const data = readData();
    const newItem = {
      id: Date.now(), // Simple ID generation
      name,
      description: description || '',
      category: category || '',
      price: parseFloat(price),
      priceUnit: priceUnit === 'm' ? 'm' : 'k',
      sellerDiscord: sellerDiscord || '',
      userId: userId || 'anonymous', // Track who added the item
      base: base || '',
      rarity: rarity || '',
      level: level ? parseInt(level) : null,
      quality: quality ? parseInt(quality) : null,
      class: itemClass || '',
      createdAt: new Date().toISOString()
    };

    data.items = data.items || [];
    data.items.push(newItem);
    writeData(data);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// GET /api/items/:id - Get specific item
router.get('/items/:id', function(req, res, next) {
  try {
    const data = readData();
    const item = data.items.find(item => item.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read item' });
  }
});

// DELETE /api/items/:id - Delete item (only if user owns it)
router.delete('/items/:id', function(req, res, next) {
  try {
    const itemId = parseInt(req.params.id);
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const data = readData();
    const itemIndex = data.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = data.items[itemIndex];
    
    // Check if user owns the item
    if (item.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }
    
    // Remove the item
    data.items.splice(itemIndex, 1);
    writeData(data);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
