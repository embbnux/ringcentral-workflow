import { styled } from '@ringcentral/juno/foundation';

export const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  height: calc(100% - 56px);
`;

export const MainContent = styled.div`
  flex: 1;
  height: 100%;
`;
