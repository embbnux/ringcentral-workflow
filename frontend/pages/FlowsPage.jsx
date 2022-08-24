import React, { useEffect, useState } from 'react';
import {
  RcTypography,
  RcButton,
  RcIcon,
} from '@ringcentral/juno';
import { styled } from '@ringcentral/juno/foundation';
import { Add } from '@ringcentral/juno-icon';
import { FlowList } from '../components/FlowList';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
`;

const Title = styled(RcTypography)`
  flex: 1;
`;

export function FlowsPage({
  navigate,
  client,
  setLoading,
  alertMessage,
}) {
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    const fetchFlows = async () => {
      setLoading(true);
      try {
        const flows = await client.getFlows();
        setFlows(flows);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        alertMessage({ type: 'error', message: 'Failed to load flows' });
      }
    };
    fetchFlows();
  }, []);
  return (
    <Container>
      <TitleLine>
        <Title variant="headline2">My Flows</Title>
        <RcButton
          startIcon={<RcIcon symbol={Add} />}
          variant="outlined"
          onClick={() => {
            navigate('/app/flows/new');
          }}
        >
          New flow
        </RcButton>
      </TitleLine>
      <FlowList
        navigate={navigate}
        flows={flows}
        onEdit={(id) => navigate(`/app/flows/${id}`)}
        onDelete={async (id) => {
          setLoading(true);
          try {
            await client.deleteFlow(id);
            setFlows(flows.filter(flow => flow.id !== id));
            setLoading(false);
          } catch (e) {
            console.error(e);
            setLoading(false);
            alertMessage({ type: 'error', message: 'Failed to delete flow' });
          }
        }}
        onToggle={async (id, enabled) => {
          setLoading(true);
          try {
            const newFlow = await client.toggleFlow(id, enabled);
            setFlows(flows.map((flow) => {
              if (flow.id === id) {
                return newFlow;
              }
              return flow;
            }));
            setLoading(false);
          } catch (e) {
            console.error(e);
            setLoading(false);
            if (e.response) {
              const errorData = await e.response.json();
              alertMessage({ type: 'error', message: errorData.message });
              return;
            }
            alertMessage({ type: 'error', message: 'Failed to toggle flow' });
          }
        }}
      />
      {
        flows.length === 0 && (
          <RcTypography color="neutral.f06">
            No flows added yet.
          </RcTypography>
        )
      }
    </Container>
  );
}
