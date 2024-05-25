import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { db} from '../config/dbConfig';
import { errorHandler } from '../middleware/errorMiddleware';
import UserRoutes from '../routes/userRoutes';
import watchlistRoutes from '../routes/watchlistRoutes';
import { authenticateToken } from '../middleware/authenticateMiddleware';

const app = express();

// Middlewares
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:9090'], credentials: true })); // Allow requests from the frontend and the server itself
app.use(compression()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);
app.use("/api/auth", UserRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.get('/', (req, res) => {
    console.log("Server running");
    res.send('Server is running!');
});

// DB connection then server connection
db.then(() => {
    app.listen(9090, () => console.log('Server is listening on port 9090'))
});
