import mongoose from 'mongoose';

export interface IWatchlist extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  symbols: string[];
}

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbols: [
    {
      type: String,
      required: true,
    },
  ],
});

const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
export default Watchlist;