require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const { checkAuth } = require('./middlewares/auth');
const { getFlow } = require('./middlewares/flow');

const authorizationRouter = require('./routers/authorize');
const homeRouter = require('./routers/home');
const userRouter = require('./routers/user');
const flowRouter = require('./routers/flow');
const flowEditorRouter = require('./routers/flowEditor');
const webhookRouter = require('./routers/webhook');

const port = process.env.PORT;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/oauth/authorize', authorizationRouter.authorize);
app.get('/oauth/callback', authorizationRouter.authCallBack);

app.get('/users/me', checkAuth, userRouter.userInfo);

app.post('/flows/:id/toggle', checkAuth, getFlow, flowRouter.toggleFlow);
app.put('/flows/:id', checkAuth, getFlow, flowRouter.updateFlow);
app.get('/flows/:id', checkAuth, getFlow, flowRouter.getFlow);
app.delete('/flows/:id', checkAuth, getFlow, flowRouter.deleteFlow);
app.get('/flows', checkAuth, flowRouter.getFlows);
app.post('/flows', checkAuth, flowRouter.createFlow);

app.get('/flow-editor/triggers', checkAuth, flowEditorRouter.getTriggers);
app.get('/flow-editor/conditions', checkAuth, flowEditorRouter.getConditions);
app.get('/flow-editor/actions', checkAuth, flowEditorRouter.getActions);
app.get('/flow-editor/actions/:actionId/params-options', checkAuth, flowEditorRouter.getActionParamsOptions);

app.post('/webhooks/:id', webhookRouter.webhookTrigger);

app.get('/', homeRouter.home);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
