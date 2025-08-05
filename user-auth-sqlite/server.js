require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const routes = require('./routes/index');

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

// Handle CORS
app.use(cors({
  origin: 'http://localhost',
  credentials: true 
}));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));