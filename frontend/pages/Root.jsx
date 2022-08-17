import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { RcSnackbar, RcSnackbarAction } from '@ringcentral/juno';
import { Close } from '@ringcentral/juno-icon';

import { LoginPage } from './LoginPage';
import { App } from './App';
import { FlowsPage } from './FlowsPage';
import { FlowEditorPage } from './FlowEditorPage';
import { HelpPage } from './HelpPage';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${palette2('nav', 'b01')};
`;

export function Root({ client }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client.token) {
      navigate('/');
    } else {
      navigate('/app/flows');
    }
    client.on('unauthorized', () => {
      navigate('/');
    });
  }, []);

  return (
    <Container>
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <App
              client={client}
              navigate={navigate}
              location={location}
              loading={loading}
            />
          }
        >
          <Route
            path="flows"
            element={
              <FlowsPage
                navigate={navigate}
                setLoading={setLoading}
                client={client}
                alertMessage={setMessage}
              />
            }
          />
          <Route
            path="flows/:id"
            element={
              <FlowEditorPage
                navigate={navigate}
                client={client}
                alertMessage={setMessage}
                setLoading={setLoading}
                loading={loading}
              />
            }
          />
          <Route
            path="help"
            element={
              <HelpPage />
            }
          />
        </Route>
      </Routes>
      <RcSnackbar
        action={
          <RcSnackbarAction
            aria-label="close"
            onClick={() => {
              setMessage({
                ...message,
                message: null,
              });
            }}
            symbol={Close}
            variant="icon"
          />
        }
        autoHideDuration={10000}
        message={message.message}
        open={!!message.message}
        type={message.type}
        onClose={(_, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setMessage({
            ...message,
            message: null,
          });
        }}
      />
    </Container>
  );
}
