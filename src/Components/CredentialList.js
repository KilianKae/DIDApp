import React, {Component} from 'react';
import {List, ListItem} from 'native-base';
import Credential from './Credential';

export default class CredentialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: this.props.credentials,
    };
  }

  createListItems() {
    let listItems = [];
    for (credential of this.state.credentials) {
      listItems.push(<Credential credential={credential}></Credential>);
    }
    return listItems;
  }

  render() {
    return this.createListItems();
  }
}
