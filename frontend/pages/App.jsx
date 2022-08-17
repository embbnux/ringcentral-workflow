import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { RcLoading } from '@ringcentral/juno';
import { AppBar } from '../components/AppBar';
import { Menu } from '../components/Menu';
import { Container, Content, MainContent } from '../components/Layout';

export function App({
  client,
  navigate,
  location,
  loading,
}) {
  const [username , setUsername] = useState('');

  useEffect(() => {
    async function getUserInfo() {
      try {
        const userInfo = await client.getUserInfo();
        setUsername(userInfo.name);
      } catch (e) {
        console.error(e);
      }
    }
    getUserInfo();
  }, []);

  return (
    <Container>
      <AppBar
        username={username}
        onLogout={() => {
          client.logout();
        }}
      />
      <RcLoading loading={loading}>
        <Content>
          <Menu navigate={navigate} location={location} />
          <MainContent>
            <Outlet />
          </MainContent>
        </Content>
      </RcLoading>
    </Container>
  );
}
