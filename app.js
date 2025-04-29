import express from 'express';
import { config } from 'dotenv';
import { db } from './src/db/index.js';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './src/routers/user.js';
import commentRouter from './src/routers/comment.js';
import coffee from './src/routers/coffee.js';
import cShop from './src/routers/coffeeshop.js';
import orderRouter from './src/routers/order.js';

config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Moved this before routes
app.use("/uploads", express.static("uploads"));

db();

app.use(morgan("dev"));

app.use("/users", userRouter);
app.use('/order', orderRouter);
app.use(cShop);
app.use(commentRouter);
app.use(coffee);

app.listen(process.env.PORT, () => {
   console.log(`Server is running on port ${process.env.PORT}`);
});
