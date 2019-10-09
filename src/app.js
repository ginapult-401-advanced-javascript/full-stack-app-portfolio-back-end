const express = require('express');

// app level middleware libraries
const morgan = require('morgan');
const cors = require('cors');

// custom middleware
const errorHandler = require('./middleware/server-error.js');
const notFoundHandler = require('./middleware/not-found.js');

// routers
const projectRouter = require('./routes/projects.js');

// instantiate express
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Actual Routes
app.use(projectRouter);
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Good to go! Listening on ${PORT}`));
  },
};
