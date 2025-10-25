import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';

const PORT = process.env.PORT || 4000;

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      message: 'Server and database are running smoothly 🚀',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed ❌',
      error: String(error),
    });
  }
});

app.use('/api/auth',authRoutes)
app.use('/api/conversations',conversationRoutes)


server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

export default app;
