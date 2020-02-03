import React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Card,
  CardItem,
  Left,
  Right,
  Body,
  Text,
} from 'native-base';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem
              header
              button
              bordered
              onPress={() => this.props.navigation.navigate('Dids')}>
              <Text>Indentifiers</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem
              header
              button
              bordered
              onPress={() => this.props.navigation.navigate('Credentials')}>
              <Text>Credentials</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
