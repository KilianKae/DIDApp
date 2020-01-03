import React, {Component} from 'react';
import {Text, List, ListItem} from 'native-base';
import DIDManager from './didManager';

//TODO
const privateEthrKey =
  '055625aecdde464cbbe6ef3ee5806ed74eafe57a01523e6a01a6d09b1c626495';

export default class DidList extends Component {
  constructor() {
    super();
    this.didManager = new DIDManager();
    //Testing
    //this.didManager.addEthrAccountFromPrivateKey(privateEthrKey);
    this.state = {
      dids: this.didManager.getDIDs(),
    };
    this.testReload = this.testReload.bind(this);
  }

  //TODO remove
  testReload() {
    this.didManager = new DIDManager();
    console.log('reload', this.didManager.getDIDs());
    this.setState({
      dids: this.didManager.getDIDs(),
    });
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
    return (
      <>
        <List>
          <ListItem>
            <Text onPress={this.testReload}>Reload</Text>
          </ListItem>
        </List>
        <List>{this.createListItems()}</List>
      </>
    );
  }
}
