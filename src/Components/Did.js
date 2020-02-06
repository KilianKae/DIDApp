import React, {Component} from 'react';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import {openURL} from '../Services/browserLinking';

export default class Did extends Component {
  handelSIOPRequest(ethrDid) {
    console.log('[Did] Generating SIOP Response');
    ethrDid
      .generateSiopResponse(this.props.requestToken)
      .then(id_token => {
        console.log('[Did] Generated SIOP response token', id_token);
        openURL(this.props.client_id + '/siopResponse', {id_token});
      })
      .catch(err => console.error('[Did] An error occurred', err));
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
