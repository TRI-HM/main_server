import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { LocalStorage } from 'node-localstorage';
import SocketsManager from './listeners/socketsManager';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error';
import routes from './domain/routes';
import SequelizeDB from './database/db';
import path from 'path';
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
