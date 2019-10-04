// app.js brings everything together
const express = require('express');

// app level middleware libraries
const morgan = require('morgan');
const cors = require('cors');

// custom middleware?
const errorHandler = require('./middleware/server-error.js');
const notFoundHandler = require('./middleware/not-found.js');

// Routes? What are they going to do? (Controllers)
const authRouter = require('./routes/auth.js');
const apiRouter = require('./routes/api.js');

// Models? all the controller logic will be imported into our routing logic
// Middlewares? What will sit between my routes and my models?

// middlewares, routes, and models will have own direcctories

const app = express();

app.use(cors());
// cross origin communication
app.use(morgan('dev'));
// logging
app.use(express.json());
// this allows header (content-type: application.json) - says the form we're sending is json - whenever somethign sends json i want you to put it on the request body
app.use(express.urlencoded({ extended: true }));

//Actual Routes
app.use(authRouter);
app.use(apiRouter);

app.get('/test', (req, res) => {
  res.send('hiii');
});

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Good to go! Listening on ${PORT}`));
  },
};
