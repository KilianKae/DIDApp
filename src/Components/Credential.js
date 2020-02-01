import React, {Component} from 'react';
import {Text, Card, CardItem, Body} from 'native-base';

export default class Credential extends Component {
  didManager;

  constructor(props) {
    super(props);
    this.state = {
      credential: this.props.credential,
    };
    console.log('[Credential] dfsdf', this.state.credential);
  }

  createClaimsList() {
    let claims = [];
    for (let claim of this.state.credential.claims) {
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
        <Card key={Math.random.toString()}>
          <CardItem header bordered>
            <Text>Credential</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>Subject</Text>
              <Text note>{this.state.credential.subject}</Text>
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
