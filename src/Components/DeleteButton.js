import React, {Component} from 'react';
import {Icon} from 'native-base';
import {TouchableOpacity, StyleSheet} from 'react-native';

export default class DeleteButton extends Component {
  render() {
    return (
      <TouchableOpacity style={this.styles.background}>
        <Icon
          name="md-remove-circle-outline"
          style={this.styles.icon}
          onPress={() => this.props.handleDelete()}
        />
      </TouchableOpacity>
    );
  }

  styles = StyleSheet.create({
    background: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 25,
      marginRight: 10,
      marginTop: 6,
      marginBottom: 6,
      backgroundColor: 'red',
    },
    icon: {color: 'white'},
  });
}
