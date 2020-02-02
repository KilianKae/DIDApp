import React, {Component} from 'react';
import {Alert} from 'react-native';
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
  Text,
} from 'native-base';
import CredentialList from '../Components/CredentialList';
import Credential from '../Models/credential-model';
import {saveCredential, getCredentials} from '../Utilities/asyncStorage';

export default class CredentialsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: [],
    };
  }

  componentDidMount() {
    console.log('[CredentialsScreen] Did mount');
    //load from async store
    let credentials = [];
    getCredentials().then(storedCredentials => {
      console.log('sdsd', storedCredentials);
      credentials = storedCredentials;
      //import from web
      const importedJWT = this.props.navigation.getParam(
        'credential',
        undefined,
      );
      if (importedJWT) {
        const credential = Credential.fromJWT(importedJWT);
        //Identical credential exists
        if (credentials.some(e => credential.compare(e))) {
          Alert.alert(
            'Similar Credential',
            'You have allready stored the same credential.',
            [
              {
                text: 'Abort',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Save',
                onPress: () => console.log('Ask me later pressed'),
              },
            ],
            {cancelable: false},
          );
        } else {
          credentials.push(credential);
          saveCredential(credential);
        }
      }
      this.setState({credentials});
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
