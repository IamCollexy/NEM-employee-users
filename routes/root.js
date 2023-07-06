const express = require('express');
const router = express.Router();
const path = require('path');

// Define routes for the root path '/'
router.get('^/$|/index(.html)?', (req, res) => {
  // res.send('Hello, world!');

  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Export the router instance
module.exports = router;
