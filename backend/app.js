const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error');
const connectDatabase = require('./config/database');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000', // frontend origin
//     credentials: true, // allow cookies/session headers
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // optional but clear
//     allowedHeaders: ['Content-Type', 'Authorization'], // optional, add others if needed
//   })
// );

// Optional: respond to preflight OPTIONS requests globally
app.options(
  '*',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// import routes
const post = require('./routes/postRoute');
const user = require('./routes/userRoute');
const chat = require('./routes/chatRoute');
const message = require('./routes/messageRoute');

app.use('/api/v1', post);
app.use('/api/v1', user);
app.use('/api/v1', chat);
app.use('/api/v1', message);

// error middleware
app.use(errorMiddleware);

// ⬇️ Start server only after DB connection is successful
const startServer = async () => {
  await connectDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
