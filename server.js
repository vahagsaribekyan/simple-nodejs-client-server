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
    let data;
    // get the user starlord55
    User.find({ username: 'vahag' }).lean().exec(function(err, users) {
      if (err) throw err;

      // object of the user
      data = users[0].texts.map((text) => text.body);
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  } catch (error) {
    errorHandler(error, req, res);
  }
});

app.post('/users/text', async (req, res) => {
  // create a new user
  let newUser = User({
    username: req.body.username,
    city: req.body.city,
    texts: [{body: req.body.text}]
  });

  // save the user
  newUser.save(function(err) {
    if (err) throw err;

    console.log('Text added for the user!');
  });

}); 

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('listening on %d', port);
});
