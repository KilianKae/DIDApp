/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
} from 'native-base';
import './shim';
import './global';
import Did from './DidList';
import DIDManager from './didManager';

function newEthrDID() {
  alert('Creating new Ethr DID');
  didManager = new DIDManager();
  didManager.newEthrDID();
}

const App: () => React$Node = () => {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>DIDs</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="add" onPress={newEthrDID} />
          </Button>
        </Right>
      </Header>
      <Content>
        <Did />
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Text>Footer</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

export default App;
