import express from 'express';
import { login, register, getAll } from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateMiddleware';

const userRouter = express.Router();

userRouter.route('/').get(authenticateToken, getAll).post(login);
userRouter.post('/register', register);

export default userRouter;
