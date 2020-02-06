import React, {Component} from 'react';
import Credential from './Credential';

export default class CredentialList extends Component {
  createListItems() {
    let listItems = [];
    for (const credential of this.props.credentials) {
      listItems.push(
        <Credential
          key={credential.id}
          credential={credential}
          returnUrl={this.props.returnUrl}
        />,
      );
    }
    return listItems;
  }

  render() {
    return this.createListItems();
  }
}
