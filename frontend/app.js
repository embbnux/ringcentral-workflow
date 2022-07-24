import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { RcThemeProvider } from '@ringcentral/juno';

const { Client } = require('./lib/client');
import { Root } from './pages/Root';

const theme = {
  palette: {
    action: {
      primary: '#2559E4',
    },
    primary: {
      main: '#2559E4',
    },
    informative: { b01: '#F5F6FB', f01: '#E3EAFC', f02: '#2559E4' },
    interactive: { b01: '#F5F6FB', b02: '#2559E4', f01: '#2559E4' },
  }
};

const client = new Client();

ReactDOM.render(
  <RcThemeProvider theme={theme}>
    <HashRouter>
      <Root client={client} />
    </HashRouter>
  </RcThemeProvider>,
  document.querySelector('div#viewport'),
);
