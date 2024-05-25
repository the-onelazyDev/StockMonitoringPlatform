import axios from 'axios';

export const fetchStockData = async (symbol: string) => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
        apikey: 'MOONMNSXRAIFGNW6',
      },
    });
    return response.data['Time Series (5min)'];
  } catch (error) {
    console.error(`Error fetching ${symbol} stock data:`, error);
    return null;
  }
};
