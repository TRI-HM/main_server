import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import SocketsManager from './listeners/socketsManager';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error';
import routes from './domain/routes';
import SequelizeDB from './database/db';
import path from 'path';
import zaloRouter from './domain/zalo/route';
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

// Expose file verify Zalo ở root path:
// GET https://<domain>/zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html
app.get(
  '/zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html',
  (req, res) => {
    const filePath = path.join(
      __dirname,
      'domain',
      'zalo',
      'zalo_verifierVEU0Se7a56bbsfLfeVuWI5-1baIpzq8PE3ao.html'
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi gửi file verify Zalo từ app.ts:', err);
        if (!res.headersSent) {
          res.status(500).send('Internal Server Error');
        }
      }
    });
  }
);
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
