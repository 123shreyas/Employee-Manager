// index.js
require('dotenv').config();
// const path = require("path");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

// app.use(express.static(path.join(__dirname, "../Frontend")));

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({ windowMs: 60*1000, max: 200 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (req, res) => res.send('Leave Management Backend'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
