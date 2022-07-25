import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { styled, palette2 } from '@ringcentral/juno/foundation';

import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';

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
      navigate('/home');
    }
    client.on('unauthorized', () => {
      navigate('/');
    })
  }, []);

  return (
    <Container>
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <HomePage
              client={client}
              navigate={navigate}
              location={location}
            />
          }
        />
      </Routes>
    </Container>
  );
}