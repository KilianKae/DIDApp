import React, {Component} from 'react';
import Credential from './Credential';

export default class CredentialList extends Component {
  createListItems() {
    let listItems = [];
    this.props.credentials.forEach((credential, i) => {
      listItems.push(
        <Credential
          key={i}
          credential={credential}
          returnUrl={this.props.returnUrl}
          returnCallback={this.props.returnCallback}
        />,
      );
    });
    return listItems;
  }

  render() {
    return this.createListItems();
  }
}
