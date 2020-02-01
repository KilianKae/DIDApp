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
import CredentialList from '../Components/CredentialList';
import Credential from '../Models/credential-model';

const credential = new Credential({
  issuer: 'issue',
  subject: 'subject',
  claim: {name: 'TestName'},
  signatur: 'signature',
});

const testCredentials = [credential, credential, credential];

export default class CredentialsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: [],
    };
    const importedCredential = this.props.navigation.getParam(
      'credential',
      undefined,
    );
    if (importedCredential) {
      this.state.credentials.push(Credential.fromJWT(importedCredential));
    }
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
          {/* <CredentialList credentials={this.props.credentials} /> */}
          <CredentialList credentials={this.state.credentials} />
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
