import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import { fetchStockData } from '../services/dashboardService';
import { fetchWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { getWatchlistFromLocalStorage } from '../utils/localStorageUtils';
import { ChartData as ChartJsChartData } from 'chart.js/auto';
import { useSharedStyles } from '../styles/styles';

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

interface ChartData extends ChartJsChartData<'line', number[], string> {}
const getLatestVolume = (stockData: { [key: string]: any } | null) => {
    if (!stockData) return null;
  
    const sortedDates = Object.keys(stockData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const latestDate = sortedDates[0];
    const latestData = stockData[latestDate];
  
    return latestData['5. volume'];
  };

const Watchlist: React.FC = () => {
  const sharedClasses = useSharedStyles();
  const [stockData, setStockData] = useState<StockData>({});
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [showChart, setShowChart] = useState<string>('');
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserWatchlist = async () => {
      try {
        const watchlistSymbols = await fetchWatchlist();
        setUserWatchlist(watchlistSymbols);
        const watchedStockData = await Promise.all(
          watchlistSymbols.map(async (symbol) => {
            const data = await fetchStockData(symbol);
            return { [symbol]: data };
          })
        );
        const mergedStockData = Object.assign({}, ...watchedStockData);
        setStockData(mergedStockData);
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
        const watchlistFromLocalStorage = getWatchlistFromLocalStorage();
        setUserWatchlist(watchlistFromLocalStorage);
      }
    };

    fetchUserWatchlist();
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

    if (showChart) {
      setChartData(generateChartData(showChart));
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
    if (showChart === symbol) {
      setShowChart('');
    } else {
      setShowChart(symbol);
    }
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      await removeFromWatchlist(symbol);
      const updatedWatchlist = userWatchlist.filter((item) => item !== symbol);
      setUserWatchlist(updatedWatchlist);
      delete stockData[symbol];
      setStockData({ ...stockData });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={sharedClasses.table} aria-label="simple table">
        <TableBody>
          {userWatchlist.map((symbol) => (
            <React.Fragment key={symbol}>
              <TableRow className={sharedClasses.tableRow}>
                <TableCell className={sharedClasses.tableCell}>
                  <div className={sharedClasses.lsvContainer}>
                    <Typography variant="h6" className={sharedClasses.symbolName}>
                      {symbol}
                    </Typography>
                    <Typography variant="body1" className={sharedClasses.lsv}>
  Volume: {getLatestVolume(stockData[symbol]) || 'N/A'}
</Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div className={sharedClasses.buttonContainer}>
                    <Button
                      variant="contained"
                      className={sharedClasses.button}
                      onClick={() => handleShowChartClick(symbol)}
                    >
                      {showChart === symbol ? 'Hide Chart' : 'Show Chart'}
                    </Button>
                    <Button
                      variant="contained"
                      className={sharedClasses.button}
                      onClick={() => handleRemoveFromWatchlist(symbol)}
                    >
                      Remove from Watchlist
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {showChart === symbol && (
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

export default Watchlist;