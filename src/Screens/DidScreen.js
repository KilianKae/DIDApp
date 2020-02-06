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
import DIDManager from '../Services/didManager';

export default class DidScreen extends React.Component {
  constructor(props) {
    super(props);
    let siopRequest = undefined;
    if (this.props.navigation.getParam('response_type', undefined)) {
      siopRequest = {
        response_type: this.props.navigation.getParam(
          'response_type',
          undefined,
        ),
        client_id: this.props.navigation.getParam('client_id', undefined),
        scope: this.props.navigation.getParam('scope', undefined),
        requestToken: this.props.navigation.getParam('request', undefined),
      };
    }

    this.state = {
      siopRequest: siopRequest,
      dids: [],
      loading: true,
    };

    this.updateDids = this.updateDids.bind(this);
    this.didManager = new DIDManager();
    console.log('[DidScreen] requestToken', this.state.requestToken);
    console.log('[DidScreen] client_id', this.state.client_id);
    console.log('[DidScreen] Received siopRequest', this.state.siopRequest);
  }

  componentDidMount() {
    console.log('[DidScreen] Mounted');
    this.didManager.subscribe(this.updateDids);
    this.didManager.importFromStorage();
  }

  componentWillUnmount() {
    this.didManager.unsubscribe(this.updateDids);
  }

  updateDids() {
    console.log('[DidScreen] Updating Dids');
    const dids = this.didManager.getDids();
    this.setState({
      dids,
      loading: false,
    });
    console.log('[DidScreen] Updating Dids', this.state.dids);
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
              <Icon
                name="arrow-back"
                onPress={() => this.props.navigation.popToTop()}
              />
            </Button>
          </Left>
          <Body>
            <Title>
              {this.state.siopRequest ? 'Select DID' : 'Identifier'}
            </Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="add" onPress={this.newEthrDid} />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {this.state.loading ? (
            <Text onPress={this.updateDids}>Loading...</Text>
          ) : null}
          {this.state.siopRequest ? (
            <DidList
              dids={this.state.dids}
              client_id={this.state.siopRequest.client_id}
              requestToken={this.state.siopRequest.requestToken}
              navigation={this.props.navigation}
            />
          ) : (
            <DidList
              dids={this.state.dids}
              navigation={this.props.navigation}
            />
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
