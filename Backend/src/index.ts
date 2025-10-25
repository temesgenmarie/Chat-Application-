import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // For future Socket.IO integration

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON body parser

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
    console.log('it is working fine ')
  res.status(200).json({
    status: 'ok',
    message: 'Server is running smoothly 🚀',
  });
});

// Set port
const PORT = process.env.PORT || 4000;

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Export app for testing or integration (optional)
export default app;
