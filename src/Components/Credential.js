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
    this.props.credential
      .createVerifiablePresentation(this.props.challenge)
      .then(vp => {
        console.log('VP', vp);
        openURL(this.props.returnUrl, {vp});
        this.props.returnCallback();
      })
      .catch(error => console.error(error));
  }

  handleDelete() {
    const credentialManager = new CredentialManager();
    credentialManager.deleteCredential(this.props.credential.signature);
  }

  leftContent = [<DeleteButton handleDelete={() => this.handleDelete()} />];

  createHeader() {
    const title = this.props.credential.type.includes('CourseCredential')
      ? 'Attendance Certification'
      : 'Credential';
    return (
      <CardItem header bordered style={this.styles.credentialColor}>
        <Text>{title}</Text>
      </CardItem>
    );
  }

  createClaimsList() {
    //{claim.key}: {claim.value}
    let valueName = '';
    if (this.props.credential.type.includes('CourseCredential')) {
      valueName = 'Course: ';
    }
    let claims = [];
    console.log(this.props.credential);
    this.props.credential.claims.forEach((claim, i) => {
      claims.push(
        <Text>
          <Text key={i + '_name'}>{valueName}</Text>
          <Text key={i + '_value'} style={this.styles.valueText}>
            {claim.value.id}
          </Text>
        </Text>,
      );
    });
    return claims;
  }

  render() {
    return (
      <Swipeable leftButtons={this.leftContent}>
        <Card>
          {this.createHeader()}
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
    valueText: {
      fontWeight: 'bold',
    },
  });
}
