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
import DidList from '../Components/DidList';
import DIDManager from '../Utilities/didManager';

export default class DidScreen extends React.Component {
  constructor(props) {
    super(props);
    //TODO null or undefiend?
    let siopRequest = null;
    // TODO Move this out of this screen / check if opend with request
    const response_type = this.props.navigation.getParam('response_type', '');
    console.log('[DidScreen] response_type:', response_type);
    if (response_type) {
      siopRequest = {
        response_type: response_type,
        client_id: this.props.navigation.getParam('client_id', ''),
        scope: this.props.navigation.getParam('scope', ''),
        requestToken: this.props.navigation.getParam('request', ''),
      };

      console.log('[DidScreen] Received siopRequest', siopRequest);

      //TODO select DID
    }

    this.state = {
      siopRequest: siopRequest,
    };
    console.log(
      '[DidScreen] Received this.state.siopRequest',
      this.state.siopRequest,
    );
  }

  newEthrDid() {
    console.log('[DidScreen] Creating new Ethr DID');
    let didManager = new DIDManager();
    didManager.newEthrDid();
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
          {this.state.siopRequest ? (
            <DidList
              client_id={this.state.siopRequest.client_id}
              requestToken={this.state.siopRequest.requestToken}
            />
          ) : (
            <DidList />
          )}
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
