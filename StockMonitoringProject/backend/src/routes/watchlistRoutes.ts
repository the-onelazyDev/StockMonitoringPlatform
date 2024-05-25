import express from 'express';
import {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
} from '../controllers/watchlistController';
import { authenticateToken } from '../middleware/authenticateMiddleware';

const watchlistRouter = express.Router();

watchlistRouter.post('/add', authenticateToken, addToWatchlist);
watchlistRouter.post('/remove', authenticateToken, removeFromWatchlist);
watchlistRouter.get('/user', authenticateToken, getUserWatchlist);

export default watchlistRouter;