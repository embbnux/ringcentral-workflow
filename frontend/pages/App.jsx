import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { AppBar } from '../components/AppBar';
import { Menu } from '../components/Menu';
import { Container, Content, MainContent } from '../components/Layout';

export function App({
  client,
  navigate,
  location,
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
      <Content>
        <Menu navigate={navigate} location={location} />
        <MainContent>
          <Outlet />
        </MainContent>
      </Content>
    </Container>
  );
}
