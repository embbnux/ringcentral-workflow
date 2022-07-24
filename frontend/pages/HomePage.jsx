import React, { useState, useEffect } from 'react';

import { AppBar } from '../components/AppBar';
import { Menu } from '../components/Menu';
import { Container, Content, MainContent } from '../components/Layout';

export function HomePage({
  client,
  navigate,
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
        <Menu navigate={navigate}/>
        <MainContent>
          <h1>Home Page</h1>
        </MainContent>
      </Content>
    </Container>
  );
}
