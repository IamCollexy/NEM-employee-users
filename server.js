require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handler urlencoded data
// in other words, form data:
// 'content-type': application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

//serve static files, In this case from the Public Folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use("/", express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
// This refresh endpoint will receive the cookie that has the refresh token
//  and that will issue an access token once the access token has expired.
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));
// code works like a waterfall, any route which we do not want to have verifyJWT, we need to have above this line
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// Handle 404 Not Found
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDb');
  app.listen(PORT, () => console.log(`server running on ${PORT}`));
});
