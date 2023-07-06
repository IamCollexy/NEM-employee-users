const express = require('express');
const path = require('path');
const rootRouter = require('./routes/root');
const { logger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(express.json());

// Use the root router
app.use('/', rootRouter);

// Must be placed after the router call above
// Serve static files
app.use(express.static('public'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// To let nodemon know you want it to execute this server.js file we run:
// nodemon --exec "node server.js"

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
