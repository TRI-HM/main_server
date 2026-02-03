// Load environment variables first, before any other imports
import dotenv from 'dotenv';
import path from 'path';

const envResult = dotenv.config({ path: path.join(__dirname, '../.env') });
if (envResult.error) {
  console.warn('Warning: .env file not found or could not be loaded:', envResult.error.message);
} else {
  console.log('Environment variables loaded from .env file');
}

// Log Zalo env vars (without showing values for security)
console.log('ZALO_AUTHORIZATION_CODE:', process.env.ZALO_AUTHORIZATION_CODE ? 'Set' : 'Not set');
console.log('ZALO_SECRET_KEY:', process.env.ZALO_SECRET_KEY ? 'Set' : 'Not set');
console.log('ZALO_APP_ID:', process.env.ZALO_APP_ID ? 'Set' : 'Not set');

import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { LocalStorage } from 'node-localstorage';
import SocketsManager from './listeners/socketsManager';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error';
import routes from './domain/routes';
import SequelizeDB from './database/db';
import zaloRouter from './domain/zalo/route';
import wishRouter from './domain/game/mirinda/route';
const app = express();
app.use(cors());
app.use(logger);
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', routes);
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));
app.use('/zalo', zaloRouter);
app.use('/mirinda', wishRouter);

const httpServer = createServer(app);



const PORT = process.env.PORT || 3000;

const StartServer = () => {
  SequelizeDB.authenticate()
    .then(() => {
      console.log('✅ Database connected successfully!');
      httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Unable to connect to the database:', err);
    }
    );
};
StartServer();
