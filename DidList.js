import React, {Component} from 'react';
import {Text, List, ListItem, Content} from 'native-base';
import DIDManager from './didManager';

//TODO
const privateEthrKey =
  '055625aecdde464cbbe6ef3ee5806ed74eafe57a01523e6a01a6d09b1c626495';

export default class DidList extends Component {
  constructor() {
    super();
    this.didManager = new DIDManager();
    //Testing
    this.didManager.addEthrAccount(privateEthrKey);

    this.state = {
      dids: this.didManager.getDIDs(),
    };
  }

  createListItems() {
    let listItems = [];
    for (did of this.state.dids) {
      listItems.push(
        <ListItem key={did}>
          <Text>{did}</Text>
        </ListItem>,
      );
    }
    return listItems;
  }

  render() {
    return <List>{this.createListItems()}</List>;
  }
}
