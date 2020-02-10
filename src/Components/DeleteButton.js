import React, {Component} from 'react';
import {Icon} from 'native-base';
import {TouchableOpacity} from 'react-native';

export default class DeleteButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: 25,
            marginRight: 10,
            marginTop: 6,
            marginBottom: 6,
            backgroundColor: 'red',
          },
        ]}>
        <Icon
          name="md-remove-circle-outline"
          style={[{color: 'white'}]}
          onPress={() => this.props.handleDelete()}
        />
      </TouchableOpacity>
    );
  }
}
