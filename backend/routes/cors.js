require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const whitelistEnv = process.env.CORS_WHITELIST;
const whitelist = whitelistEnv
  ? whitelistEnv.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  }
  else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);