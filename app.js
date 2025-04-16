const express = require('express');
const morgan = require('morgan');

const Apperror = require('./utils/apperror');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new Apperror(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'error';
  res.status(err.statuscode).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

module.exports = app;
