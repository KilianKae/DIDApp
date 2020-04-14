import React, {Component} from 'react';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import Swipeable from 'react-native-swipeable-row';
import {openURL} from '../Services/browserLinking';
import DIDManager from '../Services/didManager';
import DeleteButton from './DeleteButton';
import {stringToColour} from '../Services/colorService';

export default class Did extends Component {
  constructor(props) {
    super(props);
    this.state = {cardStyle: {}};
  }
  handelSIOPRequest() {
    console.log('[Did] Generating SIOP Response');
    this.props.ethrDid
      .generateSiopResponse(this.props.requestToken)
      .then(id_token => {
        console.log('[Did] Generated SIOP response token', id_token);
        openURL(this.props.client_id, {
          id_token,
        });
        this.props.authenthicationCallback();
      })
      .catch(err => console.error('[Did] An error occurred', err));
  }

  handleDelete() {
    const didManager = new DIDManager();
    didManager.deleteEthrAccount(this.props.ethrDid.address);
  }

  leftContent = [<DeleteButton handleDelete={() => this.handleDelete()} />];

  textStyle() {
    let textStyle = {};
    if (this.props.requestToken) {
      if (
        (this.props.client_id ===
          'http://localhost:8080/institution/a/auth/siopResponse' &&
          this.props.ethrDid.associatedServices.includes('Institution A')) ||
        (this.props.client_id ===
          'http://localhost:8080/institution/b/auth/siopResponse' &&
          this.props.ethrDid.associatedServices.includes('Institution B'))
      ) {
        textStyle = {
          color: '#0a60ff',
          fontWeight: 'bold',
        };
      }
    }
    return textStyle;
  }
  createSecondLine() {
    if (this.props.requestToken) {
      return (
        <CardItem bordered button onPress={() => this.handelSIOPRequest()}>
          <Body>
            <Text style={this.textStyle()}>Authenticate</Text>
          </Body>
          <Right>
            <Icon style={this.textStyle()} name="arrow-forward" />
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

  createUsedWithLine() {
    console.log(this.props.ethrDid.associatedServices);
    if (this.props.ethrDid.associatedServices.length) {
      return (
        <CardItem bordered button>
          <Body>
            <Text>
              Used with: {this.props.ethrDid.associatedServices.join(' | ')}
            </Text>
          </Body>
        </CardItem>
      );
    }
  }

  render() {
    //TODO
    return (
      <Swipeable leftButtons={this.leftContent}>
        <Card>
          <CardItem
            header
            bordered
            style={{
              borderTopColor: stringToColour(this.props.ethrDid.did),
              borderTopWidth: 2,
            }}>
            <Text>DID</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>{this.props.ethrDid.did}</Text>
            </Body>
          </CardItem>
          {this.createUsedWithLine()}
          {this.createSecondLine()}
        </Card>
      </Swipeable>
    );
  }
}
