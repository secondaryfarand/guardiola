import express from 'express';
import 'dotenv/config'; 
// import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.config.js';
import mainRouter from './routes/router.js';

// dotenv.config();
connectDB();

const app = express();

app.use(helmet());



app.use(cors());
app.use(express.json({ limit: '10kb' })); 

app.use('/api/v1', mainRouter);

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    system: 'The Trust Trap Guardiola API Gateway',
    version: '1.0.0',
    securityStatus: 'Active & Monitored'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Trust Trap Guardiola Backend running on port ${PORT} in ES6 Mode`);
});

export default app;