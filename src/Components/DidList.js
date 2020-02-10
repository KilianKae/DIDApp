import React, {Component} from 'react';
import Did from './Did';

export default class DidList extends Component {
  createListItems() {
    let listItems = [];
    for (const ethrDid of this.props.dids) {
      listItems.push(
        <Did
          key={ethrDid.did}
          ethrDid={ethrDid}
          navigation={this.props.navigation}
          requestToken={this.props.requestToken}
          client_id={this.props.client_id}
          authenthicationCallback={this.props.authenthicationCallback}
        />,
      );
    }
    return listItems;
  }

  render() {
    return this.createListItems();
  }
}
