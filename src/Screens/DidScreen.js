import React from 'react';
import {ActivityIndicator} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
} from 'native-base';
import LoginModal from '../Components/LoginModal';
import DidList from '../Components/DidList';
import DIDManager from '../Services/didManager';
import {isAuthentified} from '../Services/authService';
import {handelSIOPRequest, tokenHandelt} from '../Services/siopService';

export default class DidScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      siopRequest: () => this.processSIOPrequest(),
      dids: [],
      loading: true,
    };
    this.updateDids = this.updateDids.bind(this);
    this.didManager = new DIDManager();
  }

  componentDidMount() {
    console.log('[DidScreen] Mounted');
    this.didManager.subscribe(this.updateDids);
    this.didManager.importFromStorage();
  }

  componentWillUnmount() {
    console.log('[DidScreen] WillUnmount');
    this.didManager.unsubscribe(this.updateDids);
  }

  componentDidUpdate() {
    console.log('[DidScreen] DidUpdate');
  }

  processSIOPrequest() {
    let siopRequest = null;
    const navigation = this.props.navigation;
    if (navigation.getParam('response_type', null)) {
      siopRequest = {
        response_type: navigation.getParam('response_type', null),
        client_id: navigation.getParam('client_id', null),
        scope: navigation.getParam('scope', null),
        requestToken: navigation.getParam('request', null),
      };
      if (
        isAuthentified() &&
        !tokenHandelt(siopRequest.requestToken) &&
        !this.didManager.ethrDids.some(
          did => did.associatedService?.client_id === siopRequest.client_id,
        )
      ) {
        const pairDid = this.newEthrDid();
        handelSIOPRequest(
          pairDid,
          siopRequest.requestToken,
          siopRequest.client_id,
          () => this.resetNavigationParams(),
        );
      }
      console.log('[DidScreen] Received siopRequest', siopRequest);
    }
    return siopRequest;
  }

  resetNavigationParams() {
    this.props.navigation.setParams({
      response_type: undefined,
      client_id: undefined,
      scope: undefined,
      requestToken: undefined,
    });
  }

  updateDids() {
    console.log('[DidScreen] Updating Dids...');
    const dids = this.didManager.getDids();
    this.setState({
      dids,
      loading: false,
    });
  }

  newEthrDid() {
    console.log('[DidScreen] Creating new Ethr DID...');
    let didManager = new DIDManager();
    return didManager.newEthrDid();
  }

  handleBack() {
    this.props.navigation.popToTop();
    this.resetNavigationParams();
  }

  render() {
    return (
      <>
        <LoginModal />
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" onPress={() => this.handleBack()} />
              </Button>
            </Left>
            <Body>
              <Title>
                {this.state.siopRequest() ? 'Select DID' : 'Identifier'}
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
              <ActivityIndicator size="large" color="#0A60FF" />
            ) : null}
            {this.state.siopRequest() ? (
              <DidList
                dids={this.state.dids}
                client_id={this.state.siopRequest().client_id}
                requestToken={this.state.siopRequest().requestToken}
                navigation={this.props.navigation}
                authenthicationCallback={() => this.resetNavigationParams()}
              />
            ) : (
              <DidList
                dids={this.state.dids}
                navigation={this.props.navigation}
              />
            )}
          </Content>
        </Container>
      </>
    );
  }
}
