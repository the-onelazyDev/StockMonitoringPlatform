import axios from 'axios';

// Assuming you have stored the JWT in localStorage
const token = localStorage.getItem('token');

export const addToWatchlist = async (symbol: string): Promise<{ message: string; watchlist: string[] }> => {
  try {
    const response = await axios.post(
      'http://localhost:9090/api/watchlist/add',
      { symbol },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error adding symbol to watchlist');
  }
};

export const removeFromWatchlist = async (symbol: string): Promise<{ message: string; watchlist: string[] }> => {
  try {
    const response = await axios.post(
      'http://localhost:9090/api/watchlist/remove',
      { symbol },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error removing symbol from watchlist');
  }
};

export const fetchWatchlist = async (): Promise<string[]> => {
  try {
    const response = await axios.get('http://localhost:9090/api/watchlist/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Assuming the response data has the structure { success: true, watchlist: [...] }
    if (response.data.success && Array.isArray(response.data.watchlist)) {
      return response.data.watchlist;
    } else {
      throw new Error('Invalid watchlist data');
    }
  } catch (error) {
    throw new Error('Error fetching watchlist');
  }
};