import React from 'react';
import {Modal, Alert} from 'react-native';
import {
  Text,
  Form,
  Item,
  Label,
  Input,
  Button,
  Card,
  CardItem,
} from 'native-base';
import {
  setPassword,
  isPasswordSet,
  login,
  isAuthentified,
} from '../Services/authService';

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      error: false,
      passwordState: {buttonText: 'Loading', isLoading: true},
      visible: !isAuthentified(),
    };
  }

  componentDidMount() {
    isPasswordSet()
      .then(isSet => {
        this.setState({buttonText: isSet ? 'Login' : 'Set Password'});
      })
      .catch(error => console.error(error));
  }

  handlePasswordSubmission() {
    //TODO better state managment without strings
    if (this.state.buttonText === 'Login') {
      login(this.state.password)
        .then(isValid => {
          if (isValid) {
            this.setState({visible: false});
          } else {
            this.setState({error: true});
          }
        })
        .catch(error => console.error(error));
    } else if (this.state.buttonText === 'Set Password') {
      setPassword(this.state.password);
      this.setState({visible: false});
    }
    //this.props.navigation.navigate('Dids');
  }

  render() {
    return (
      <Modal
        animationType="none"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <Card style={{top: '25%'}}>
          <CardItem bordered>
            <Form style={{width: '100%'}}>
              <Item
                error={this.state.error}
                floatingLabel
                style={{marginLeft: 0, marginBottom: 20}}>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={password =>
                    this.setState({password, error: false})
                  }
                  value={this.state.password}
                />
              </Item>
              <Button
                full
                primary
                style={{marginBottom: 10}}
                onPress={() => this.handlePasswordSubmission()}>
                <Text>{this.state.buttonText}</Text>
              </Button>
            </Form>
          </CardItem>
        </Card>
      </Modal>
    );
  }
}
