import React, {Component} from 'react';
import {Linking} from 'react-native';
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
import DeepLinking from 'react-native-deep-linking';

function newEthrDID() {
  alert('Creating new Ethr DID');
  didManager = new DIDManager();
  didManager.newEthrDID();
}

export default class HomeScreen extends React.Component {
  componentDidMount() {
    Linking.addEventListener('url', this._handleUrl);
    DeepLinking.addScheme('didapp://');
    DeepLinking.addRoute('/login/returnUrl/:returnUrl', response => {
      Linking.openURL(decodeURIComponent(response.returnUrl));
      console.log('[App] Received response: ', response);
    });
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrl);
    DeepLinking.resetSchemes();
    DeepLinking.resetRoutes();
  }

  _handleUrl = ({url}) => {
    console.log('[App] Handling url: ', url);
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  render() {
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
  }
}
