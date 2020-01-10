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
import Did from '../Components/DidList';
import DIDManager from '../Utilities/didManager';

function newEthrDID() {
  console.log('[HomeScreen] Creating new Ethr DID');
  didManager = new DIDManager();
  didManager.newEthrDID();
}

export default class DidScreen extends React.Component {
  constructor(props) {
    super(props);
    // TODO Move this out of this screen

    const SIOPRequest = {
      client_id: this.props.navigation.getParam('client_id', ''),
      scope: this.props.navigation.getParam('scope', ''),
      request: this.props.navigation.getParam('request', ''),
    };
    console.log('[DidScreen] Received SIOPRequest', SIOPRequest);

    this.state = {
      returnUrl: SIOPRequest.client_id,
    };
  }

  componentDidMount() {
    if (this.state.returnUrl) {
      Linking.canOpenURL(this.state.returnUrl)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + this.state.returnUrl);
          } else {
            return Linking.openURL(this.state.returnUrl);
          }
        })
        .catch(err => console.error('An error occurred', err));
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
