import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchStockData } from '../services/dashboardService';
import { ChartData as ChartJsChartData } from 'chart.js/auto';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { addToWatchlist, removeFromWatchlist, fetchWatchlist } from '../services/watchlistService';
import { useNavigate } from 'react-router-dom';
import { useSharedStyles } from '../styles/styles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockData {
  [key: string]: {
    [key: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  } | null;
}

interface LatestStockValues {
  [key: string]: string;
}

interface ChartData extends ChartJsChartData<'line', number[], string> {}

const Dashboard: React.FC = () => {
  const classes = useSharedStyles();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState<StockData>({ MSFT: null, GOOG: null, GME: null, NVDA: null, TSLA: null, AAPL: null, NVAX: null });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [showChart, setShowChart] = useState<string[]>([]);
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);
  const [latestStockValues, setLatestStockValues] = useState<LatestStockValues>({
    MSFT: 'N/A',
    GOOG: 'N/A',
    GME: 'N/A',
    NVDA: 'N/A',
    TSLA: 'N/A',
    AAPL: 'N/A',
    NVAX: 'N/A',
  });
  

  useEffect(() => {
    console.log("Fetching watchlist data...");
    fetchUserWatchlist();
  }, [navigate]);
  
  const fetchUserWatchlist = async () => {
    try {
      const watchlistSymbols = await fetchWatchlist();
      console.log("Fetched watchlist data:", watchlistSymbols);
      setUserWatchlist(watchlistSymbols);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async (symbol: string) => {
      try {
        const data = await fetchStockData(symbol);
        if (data) {
          setStockData((prevStockData) => ({ ...prevStockData, [symbol]: data }));
          const labels = Object.keys(data);
          const latestVolume = data[labels[0]]['5. volume'] || 'N/A';
          setLatestStockValues((prevLatestStockValues) => ({ ...prevLatestStockValues, [symbol]: latestVolume }));
        } else {
          setLatestStockValues((prevLatestStockValues) => ({ ...prevLatestStockValues, [symbol]: 'N/A' }));
        }
      } catch (error) {
        console.error(`Error fetching ${symbol} stock data:`, error);
        setLatestStockValues((prevLatestStockValues) => ({ ...prevLatestStockValues, [symbol]: 'N/A' }));
      }
    };

    const symbols = ['MSFT', 'GOOG', 'GME', 'NVDA', 'TSLA', 'AAPL', 'NVAX'];
    symbols.forEach((symbol) => fetchData(symbol));
  }, []);

  useEffect(() => {
    const generateChartData = (symbol: string): ChartData | null => {
      const stock = stockData[symbol];
      if (stock) {
        const labels = Object.keys(stock);
        const prices = Object.values(stock).map((data) => parseFloat(data['4. close']));
        const data: ChartData = {
          labels: labels.map((_, index) => index.toString()),
          datasets: [
            {
              label: `${symbol} Stock Price`,
              data: prices,
              fill: false,
              borderColor: getRandomColor(),
              tension: 0.1,
            },
          ],
        };
        return data;
      }
      return null;
    };

    if (showChart.length > 0) {
      setChartData(generateChartData(showChart[0]));
    } else {
      setChartData(null);
    }
  }, [stockData, showChart]);

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleShowChartClick = (symbol: string) => {
    if (showChart.includes(symbol)) {
      setShowChart(showChart.filter((item) => item !== symbol));
    } else {
      setShowChart([...showChart, symbol]);
    }
  };

  const handleWatchlistClick = async (symbol: string) => {
    try {
      if (userWatchlist.includes(symbol)) {
        await removeFromWatchlist(symbol);
        setUserWatchlist(userWatchlist.filter((item) => item !== symbol));
      } else {
        await addToWatchlist(symbol);
        setUserWatchlist([...userWatchlist, symbol]);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {Object.keys(latestStockValues).map((symbol) => (
            <React.Fragment key={symbol}>
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell}>
                  <div className={classes.lsvContainer}>
                    <Typography variant="h6" className={classes.symbolName}>
                      {symbol}
                    </Typography>
                    <Typography variant="body1" className={classes.lsv}>
                      Volume: {latestStockValues[symbol]}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div className={classes.buttonContainer}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={() => handleShowChartClick(symbol)}
                    >
                      {showChart.includes(symbol) ? 'Hide Chart' : 'Show Chart'}
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={() => handleWatchlistClick(symbol)}
                    >
                      {userWatchlist.includes(symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {showChart.includes(symbol) && (
                <TableRow>
                  <TableCell colSpan={2}>
                    {chartData ? (
                      <Line data={chartData} />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Dashboard;