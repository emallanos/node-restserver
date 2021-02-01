const express = require('express'); //Express
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;