require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const authorizationRouter = require('./routers/authorize');
const homeRouter = require('./routers/home');

const port = process.env.PORT;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/oauth/authorize', authorizationRouter.authorize);
app.get('/oauth/callback', authorizationRouter.authCallBack);

app.get('/', homeRouter.home);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
