import React, {Component} from 'react';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import Swipeable from 'react-native-swipeable-row';
import {openURL} from '../Services/browserLinking';
import DIDManager from '../Services/didManager';
import DeleteButton from './DeleteButton';

export default class Did extends Component {
  handelSIOPRequest() {
    console.log('[Did] Generating SIOP Response');
    this.props.ethrDid
      .generateSiopResponse(this.props.requestToken)
      .then(id_token => {
        console.log('[Did] Generated SIOP response token', id_token);
        openURL(this.props.client_id + '/siopResponse', {
          id_token,
        });
      })
      .catch(err => console.error('[Did] An error occurred', err));
  }

  handleDelete() {
    const didManager = new DIDManager();
    didManager.deleteEthrAccount(this.props.ethrDid.address);
  }

  leftContent = [<DeleteButton handleDelete={() => this.handleDelete()} />];

  createSecondLine() {
    if (this.props.requestToken) {
      return (
        <CardItem bordered button onPress={() => this.handelSIOPRequest()}>
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
            <Text>Credentials</Text>
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
      <Swipeable leftButtons={this.leftContent}>
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
      </Swipeable>
    );
  }
}
