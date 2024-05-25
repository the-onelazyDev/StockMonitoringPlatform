import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Watchlist, { IWatchlist } from '../models/watchlist';

// @Desc Add a symbol to user's watchlist
// @Route /api/watchlist/add
// @Method POST
export const addToWatchlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { symbol } = req.body;
      const userId = req.user.id;
  
      try {
        let watchlist = await Watchlist.findOne({ user: userId });
  
        if (watchlist) {
          // Watchlist exists, check if symbol is already present
          if (watchlist.symbols.includes(symbol)) {
            return next(new Error('Symbol already exists in watchlist'));
          }
          watchlist.symbols.push(symbol);
          await watchlist.save();
        } else {
          // Watchlist doesn't exist, create a new one
          watchlist = new Watchlist({ user: userId, symbols: [symbol] });
          await watchlist.save();
          const user = await User.findById(userId);
          if (user) {
            user.watchlist = watchlist._id;
            await user.save();
          }
        }
  
        res.status(201).json({
          // success: true,
          message: 'Symbol added to watchlist',
          watchlist: watchlist.symbols,
        });
      } catch (error) {
        next(error);
      }
    }
  );

// @Desc Remove a symbol from user's watchlist
// @Route /api/watchlist/remove
// @Method POST
export const removeFromWatchlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { symbol } = req.body;
      const userId = req.user.id;
  
      try {
        const user = await User.findById(userId).populate('watchlist');
        if (!user) {
          return next(new Error('User not found'));
        }
  
        const watchlist = user.watchlist as IWatchlist;
        if (!watchlist) {
          return next(new Error('Watchlist not found'));
        }
  
        if (!watchlist.symbols.includes(symbol)) {
          return next(new Error('Symbol not found in watchlist'));
        }
  
        watchlist.symbols = watchlist.symbols.filter(
          (item: string) => item !== symbol
        );
        await watchlist.save();
  
        res.status(200).json({
          success: true,
          message: 'Symbol removed from watchlist',
          watchlist: watchlist.symbols,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  export const getUserWatchlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
  
      try {
        const user = await User.findById(userId).populate('watchlist');
        if (!user) {
          return next(new Error('User not found'));
        }
  
        const watchlist = user.watchlist;
        const symbols = watchlist ? watchlist.symbols : [];
  
        res.status(200).json({
          success: true,
          watchlist: symbols,
        });
      } catch (error) {
        next(error);
      }
    }
  );