export const getWatchlistFromLocalStorage = () => {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  };
  
  export const saveWatchlistToLocalStorage = (watchlist) => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  };