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
import {Linking} from 'react-native';
import DidList from '../Components/DidList';
import DIDManager from '../Utilities/didManager';

export default class DidScreen extends React.Component {
  constructor(props) {
    super(props);
    let myIDRequest = null;
    // TODO Move this out of this screen / check if opend with request
    const response_type = this.props.navigation.getParam('response_type', '');
    console.log('[DidScreen] response_type:', response_type);
    if (response_type) {
      myIDRequest = {
        response_type: response_type,
        client_id: this.props.navigation.getParam('client_id', ''),
        scope: this.props.navigation.getParam('scope', ''),
        request: this.props.navigation.getParam('request', ''),
      };

      console.log('[DidScreen] Received myIDRequest', myIDRequest);

      //TODO select DID
    }

    this.state = {
      myIDRequest: myIDRequest,
    };
    console.log(
      '[DidScreen] Received this.state.myIDRequest',
      this.state.myIDRequest,
    );
  }

  newEthrDid() {
    console.log('[DidScreen] Creating new Ethr DID');
    let didManager = new DIDManager();
    didManager.newEthrDid();
  }

  openReturnUrl() {
    if (this.state.returnUrl) {
      Linking.canOpenURL(this.state.returnUrl)
        .then(supported => {
          if (!supported) {
            console.log(
              '[DidScreen] Url is unsported: ' + this.state.returnUrl,
            );
          } else {
            Linking.openURL(this.state.returnUrl);
          }
        })
        .catch(err => console.error('[DidScreen] An error occurred', err));
    }
  }

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
              <Icon name="add" onPress={this.newEthrDid} />
            </Button>
          </Right>
        </Header>
        <Content>
          <DidList myIDRequest={this.state.myIDRequest} />
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
