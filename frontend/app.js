import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { RcThemeProvider } from '@ringcentral/juno';

const { Client } = require('./lib/client');
import { Root } from './pages/Root';

const client = new Client();

ReactDOM.render(
  <RcThemeProvider>
    <HashRouter>
      <Root client={client} />
    </HashRouter>
  </RcThemeProvider>,
  document.querySelector('div#viewport'),
);
