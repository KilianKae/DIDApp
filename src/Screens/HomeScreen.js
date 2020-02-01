import React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
} from 'native-base';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Button onPress={() => this.props.navigation.navigate('Dids')}>
            <Text>DIDs</Text>
          </Button>
          <Button onPress={() => this.props.navigation.navigate('Credentials')}>
            <Text>Credentials</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
