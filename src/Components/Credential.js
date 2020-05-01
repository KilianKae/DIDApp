import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Card, CardItem, Body, Right, Icon} from 'native-base';
import {openURL} from '../Services/browserLinking';
import DeleteButton from './DeleteButton';
import Swipeable from 'react-native-swipeable-row';
import CredentialManager from '../Services/credentialManager';
import {stringToColour} from '../Services/colorService';

export default class Credential extends Component {
  handleReturnUrl() {
    const query = {
      subject: this.props.credential.subject,
      issuer: this.props.credential.issuer,
      signature: this.props.credential.signature,
      claims: JSON.stringify(this.props.credential.claims),
    };
    openURL(this.props.returnUrl, query);
    this.props.returnCallback();
  }

  handleDelete() {
    const credentialManager = new CredentialManager();
    credentialManager.deleteCredential(this.props.credential.signature);
  }

  leftContent = [<DeleteButton handleDelete={() => this.handleDelete()} />];

  createClaimsList() {
    //{claim.key}: {claim.value}
    let claims = [];
    this.props.credential.claims.forEach((claim, i) => {
      claims.push(<Text key={i}>Introduction to CS</Text>);
    });
    return claims;
  }

  render() {
    return (
      <Swipeable leftButtons={this.leftContent}>
        <Card>
          <CardItem header bordered style={this.styles.credentialColor}>
            <Text>Course</Text>
          </CardItem>
          <CardItem bordered>
            <Body>{this.createClaimsList()}</Body>
          </CardItem>
          {this.props.returnUrl ? (
            <CardItem bordered button onPress={() => this.handleReturnUrl()}>
              <Body>
                <Text>Send</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
          ) : null}
        </Card>
      </Swipeable>
    );
  }
  styles = StyleSheet.create({
    credentialColor: {
      borderTopColor: stringToColour(this.props.credential.subject),
      borderTopWidth: 2,
    },
  });
}
