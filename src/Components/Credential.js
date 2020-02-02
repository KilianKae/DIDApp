import React, {Component} from 'react';
import {Text, Card, CardItem, Body} from 'native-base';

export default class Credential extends Component {
  createClaimsList() {
    let claims = [];
    for (let claim of this.props.credential.claims) {
      claims.push(
        <Text note>
          {claim.key}: {claim.value}
        </Text>,
      );
    }
    return claims;
  }

  render() {
    //TODO
    return (
      <>
        <Card>
          <CardItem header bordered>
            <Text>Credential</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>Subject</Text>
              <Text note>{this.props.credential.subject}</Text>
            </Body>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>Claims</Text>
              {this.createClaimsList()}
            </Body>
          </CardItem>
        </Card>
      </>
    );
  }
}
