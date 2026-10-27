require('dotenv').config({ quiet: true });

const express = require('express');
const issueRoutes = require('./routes/issues');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      error: { code: 'ORIGIN_NOT_ALLOWED', message: 'This website is not allowed to use the API.' }
    });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use('/api/issues', issueRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: 'Route not found.' }
  });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request body is not valid JSON.'
      }
    });
  }

  console.error(error);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected server error occurred.'
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    const env = process.env.NODE_ENV || 'development';
    console.log(`Cloud Issue API listening on http://localhost:${PORT} (${env})`);
  });
}

module.exports = app;