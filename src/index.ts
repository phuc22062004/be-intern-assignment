import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { AppDataSource } from './data-source';
import { postRouter } from './routes/post.routes';
import { followRouter } from './routes/follow.routes';
import { likeRouter } from './routes/like.routes';
import { hashtagRouter } from './routes/hashtag.routes';
import { postHashtagRouter } from './routes/post_hashtag.routes';
import { customRouter } from './routes/custom.routes';


dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Platform API! Server is running successfully.');
});

app.use('/api/users', userRouter);
app.use('/api/post',postRouter);
app.use('/api/like',likeRouter);
app.use('/api/posthashtag',postHashtagRouter);
app.use('/api/hashtag',hashtagRouter);
app.use('/api/follow',followRouter);
app.use('/api',customRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
