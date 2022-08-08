import React, { useRef, useState } from 'react';
import {
  RcAppBar,
  RcTypography,
  RcIconButton,
  RcButton,
  RcIcon,
  RcMenu,
  RcMenuItem,
  RcListItemText,
} from '@ringcentral/juno';
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { ChevronLeft, Add } from '@ringcentral/juno-icon';
import { FlowEditor } from '../components/FlowEditor';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${palette2('neutral', 'b03')};
`;

const Title = styled(RcTypography)`
  margin-right: 10px;
  line-height: 56px;
  flex: 1;
`;

const Header = styled(RcAppBar)`
  background: ${palette2('nav', 'b01')};
  padding-left: 10px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: calc(100% - 56px);
`;

const Button = styled(RcButton)`
  margin-left: 20px;
`;

export function FlowEditorPage({
  navigate,
}) {
  const addButtonRef = useRef(null);
  const [addButtonMenuOpen, setAddButtonMenuOpen] = useState(false);

  return (
    <Container>
      <Header color="transparent" variant='outlined'>
        <RcIconButton
          symbol={ChevronLeft}
          onClick={() => {
            navigate('/app/flows');
          }}
        />
        <Title variant="subheading1" noWrap>
          Flow Editor
        </Title>
        <Button
          startIcon={<RcIcon symbol={Add} />}
          variant="outlined"
          color="label.blue01"
          innerRef={addButtonRef}
          onClick={() => {
            setAddButtonMenuOpen(true);
          }}
        >
          Add node
        </Button>
        <RcMenu
          anchorEl={addButtonRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom'
          }}
          onClose={() => {
            setAddButtonMenuOpen(false);
          }}
          open={addButtonMenuOpen}
        >
          <RcMenuItem>
            <RcListItemText primary="Add trigger" />
          </RcMenuItem>
          <RcMenuItem>
            <RcListItemText primary="Add condition" />
          </RcMenuItem>
          <RcMenuItem>
            <RcListItemText primary="Add action" />
          </RcMenuItem>
        </RcMenu>
        <Button color="label.blue01">
          Save
        </Button>
      </Header>
      <EditorContainer>
        <FlowEditor />
      </EditorContainer>
    </Container>
  );
}
