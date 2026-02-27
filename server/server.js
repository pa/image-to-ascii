const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/image');

const app = express();
const PORT = process.env.PORT || 3038;

app.use(cors());
app.use(express.json());

app.use('/api', imageRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
