import React, {Component} from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
  Button,
  Icon,
} from 'native-base';
import LoginModal from '../Components/LoginModal';
import CredentialList from '../Components/CredentialList';
import CredentialManager from '../Services/credentialManager';

export default class CredentialsScreen extends Component {
  credentialManager = undefined;

  constructor(props) {
    super(props);
    this.state = {
      credentials: [],
    };
    this.credentialManager = new CredentialManager();
    this.updateCredentials = this.updateCredentials.bind(this);
  }

  componentDidMount() {
    console.log('[CredentialsScreen] Did mount');
    this.credentialManager.subscribe(this.updateCredentials);
    this.credentialManager.importFromStorage();
    this.processCredentialParam();
  }

  componentWillUnmount() {
    this.credentialManager.unsubscribe(this.updateCredentials);
  }

  componentDidUpdate() {
    this.processCredentialParam();
  }

  resetCredentialParam() {
    this.props.navigation.setParams({credential: undefined});
  }

  resetReturnParams() {
    this.props.navigation.setParams({returnUrl: undefined});
  }

  processCredentialParam() {
    const importedJWT = this.props.navigation.getParam('credential', null);
    if (importedJWT) {
      this.credentialManager.addCredentialFromJWT(importedJWT);
      this.resetCredentialParam();
    }
  }

  updateCredentials() {
    this.setState({
      credentials: this.credentialManager.getCredentials(
        this.props.navigation.getParam('did', undefined),
      ),
    });
  }

  createNavigation() {
    return (
      <Button transparent>
        <Icon
          name="arrow-back"
          onPress={() =>
            this.props.navigation.getParam('did', null)
              ? this.props.navigation.pop()
              : this.props.navigation.popToTop()
          }
        />
      </Button>
    );
  }

  render() {
    console.log(this.state.credentials);
    return (
      <>
        <Container>
          <Header>
            <Left>{this.createNavigation()}</Left>
            <Body>
              <Title>
                {this.props.navigation.getParam('returnUrl', null)
                  ? 'Select Credential'
                  : 'Credentials'}
              </Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            <CredentialList
              credentials={this.state.credentials}
              returnUrl={this.props.navigation.getParam('returnUrl', undefined)}
              returnCallback={() => this.resetReturnParams()}
            />
          </Content>
        </Container>
      </>
    );
  }
}
