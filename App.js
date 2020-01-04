/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

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

//Deep Linking

function newEthrDID() {
  alert('Creating new Ethr DID');
  didManager = new DIDManager();
  didManager.newEthrDID();
}

export default class App extends Component {
  componentDidMount() {
    Linking.addEventListener('url', this._handleUrl);
    DeepLinking.addScheme('didapp://');
    DeepLinking.addRoute('/login/returnUrl/:returnUrl', response => {
      // example://test/23
      Linking.openURL(decodeURIComponent(response.returnUrl));
      console.log('fdddf', response); // 23
    });
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrl);
    DeepLinking.resetSchemes();
    DeepLinking.resetRoutes();
  }

  _handleUrl = ({url}) => {
    console.log(url);
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
