const express = require('express');
const https = require('https');
const fs = require('fs');
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
    let found = false;
    User.findOne({username: req.body.username}, (err, user) => {
      if(!user) return;
        found = true;
        for (let j = 0; j < user.texts.length; ++j) {
          if(user.texts[j].body == req.body.text) {
            res.send("already subitted");
            return;
          }
        }
        user.texts.push({body: req.body.text});
        user.save((err) => {
          if(err) throw err;
        });
        res.send();
    });

    if(!found) {
      // create a new user
      let newUser = new User({
        username: req.body.username,
        city: req.body.city,
        texts: [{ body: req.body.text }]
      });

      await newUser.save();
      res.send();
    }

  } catch (error) {
    console.log(error)
    errorHandler(error, req, res);
  }
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// to support https we give paths for certificate and key
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
  console.log('listening on %d', port);
});
