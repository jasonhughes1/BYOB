const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' + req.get('host') + req.rul);
  }
  next();
}
