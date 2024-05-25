import axios from 'axios';

// Function to fetch latest stock value for a symbol from Alpha Vantage API
export const fetchStockValue = async (symbol: string): Promise<number | null> => {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=MOONMNSXRAIFGNW6`);
        const latestData = response.data["Time Series (5min)"];
        const latestTimestamp = Object.keys(latestData)[0];
        return parseFloat(latestData[latestTimestamp]['4. close']);
    } catch (error) {
        console.error("Error fetching stock value:", error);
        return null;
    }
};
