import React, {Component} from 'react';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import {Linking} from 'react-native';

export default class Did extends Component {
  handelSIOPRequest(ethrDid) {
    console.log('[DidScreen] Generating SIOP Response');
    ethrDid
      .generateSiopResponse(this.props.requestToken)
      .then(siopResponseToken => {
        console.log(
          '[DidScreen] Received SIOP response token',
          siopResponseToken,
        );
        this.openReturnUrl(this.props.client_id, siopResponseToken);
      })
      .catch(err => console.error('[DidScreen] An error occurred', err));
  }

  openReturnUrl(client_id, siopResponseToken) {
    let url = client_id;
    url += '/siopResponse?id_token=';
    url += siopResponseToken;
    console.log('[DidScreen] Return url: ' + url);
    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log('[DidScreen] Url is unsported: ' + url);
          } else {
            Linking.openURL(url);
          }
        })
        .catch(err => console.error('[DidScreen] An error occurred', err));
    }
  }

  createSecondLine() {
    if (this.props.requestToken) {
      return (
        <CardItem
          bordered
          button
          onPress={() => this.handelSIOPRequest(this.props.ethrDid)}>
          <Body>
            <Text>Authenticate</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      );
    } else {
      return (
        <CardItem
          bordered
          button
          onPress={() =>
            this.props.navigation.navigate('Credentials', {
              did: this.props.ethrDid.did,
            })
          }>
          <Body>
            <Text>Claims</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      );
    }
  }

  render() {
    //TODO
    return (
      <>
        <Card>
          <CardItem header bordered>
            <Text>DID</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>{this.props.ethrDid.did}</Text>
            </Body>
          </CardItem>
          {this.createSecondLine()}
        </Card>
      </>
    );
  }
}
