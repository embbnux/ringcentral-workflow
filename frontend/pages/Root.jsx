import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { styled, palette2 } from '@ringcentral/juno/foundation';

import { LoginPage } from './LoginPage';
import { App } from './App';
import { FlowsPage } from './FlowsPage';
import { FlowEditorPage } from './FlowEditorPage';
import { AboutPage } from './AboutPage';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${palette2('nav', 'b01')};
`;

export function Root({ client }) {
  const navigate = useNavigate();
  const location = useLocation();

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
            />
          }
        >
          <Route
            path="flows"
            element={
              <FlowsPage
                navigate={navigate}
              />
            }
          />
          <Route
            path="flows/:id"
            element={
              <FlowEditorPage />
            }
          />
          <Route
            path="about"
            element={
              <AboutPage />
            }
          />
        </Route>
      </Routes>
    </Container>
  );
}
