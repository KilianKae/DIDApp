import React, {Component} from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
} from 'native-base';
import CredentialList from '../Components/CredentialList';
import CredentialManager from '../Utilities/credentialManager';

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
    const importedJWT = this.props.navigation.getParam('credential', undefined);
    if (importedJWT) {
      this.credentialManager.addCredentialFromJWT(importedJWT);
    }
  }

  updateCredentials() {
    this.setState({
      credentials: this.credentialManager.getCredentials(
        this.props.navigation.getParam('did', undefined),
      ),
    });
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Credentials</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <CredentialList credentials={this.state.credentials} />
        </Content>
      </Container>
    );
  }
}
