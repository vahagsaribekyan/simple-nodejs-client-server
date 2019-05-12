const express = require('express');
const bodyParser = require('body-parser');

require("./db.js");
let User = require('./users');

const app = express();
const port = process.env.PORT || 8080;

// Set public folder as root
app.use(express.static('public'));

// Parse POST data as URL encoded data
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Parse POST data as JSON
app.use(bodyParser.json());

// Provide access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

const errorHandler = (err, req, res) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.status(403).send({ title: 'Server responded with an error', message: err.message });
  } else if (err.request) {
    // The request was made but no response was received
    res.status(503).send({ title: 'Unable to communicate with server', message: err.message });
  } else {
    // Something happened in setting up the request that triggered an Error
    res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
  }
};

// Fetch Latest Currency Rates
app.get('/users', async (req, res) => {
  try {
    let username = req.query.username;
    if(username) {
      const user = await User.find({ username });
      res.send(user);
    } else {
      res.send();
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

app.post('/users/text', async (req, res) => {
  try {
    // create a new user
    let newUser = new User({
      username: req.body.username,
      city: req.body.city,
      texts: [{ body: req.body.text }]
    });
    const data = await newUser.save();
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('listening on %d', port);
});
