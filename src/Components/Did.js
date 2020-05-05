import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import Swipeable from 'react-native-swipeable-row';
import {handelSIOPRequest} from '../Services/siopService';
import DIDManager from '../Services/didManager';
import DeleteButton from './DeleteButton';
import {stringToColour} from '../Services/colorService';

export default class Did extends Component {
  constructor(props) {
    super(props);
    this.state = {cardStyle: {}};
  }

  handelSIOPRequest() {
    handelSIOPRequest(
      this.props.ethrDid,
      this.props.requestToken,
      this.props.client_id,
      this.props.authenthicationCallback,
    );
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
          this.props.ethrDid.associatedService?.name === 'Institution A') ||
        (this.props.client_id ===
          'http://localhost:8080/institution/b/auth/siopResponse' &&
          this.props.ethrDid.associatedService?.name === 'Institution B')
      ) {
        textStyle = this.styles.authenticationHighlight;
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

  createHeader() {
    if (this.props.ethrDid.associatedService) {
      return (
        <CardItem header bordered style={this.styles.didCardItem}>
          <Text>{this.props.ethrDid.associatedService.name}</Text>
        </CardItem>
      );
    } else {
      return (
        <CardItem header bordered style={this.styles.didCardItem}>
          <Text>DID</Text>
        </CardItem>
      );
    }
  }

  render() {
    return (
      <Swipeable leftButtons={this.leftContent}>
        <Card>
          {this.createHeader()}
          {this.createSecondLine()}
        </Card>
      </Swipeable>
    );
  }

  styles = StyleSheet.create({
    authenticationHighlight: {
      color: '#0a60ff',
      fontWeight: 'bold',
    },
    didCardItem: {
      borderTopColor: stringToColour(this.props.ethrDid.did),
      borderTopWidth: 2,
    },
  });
}
