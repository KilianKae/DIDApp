import React, {Component} from 'react';
import {Text, List, ListItem} from 'native-base';
import DIDManager from '../Utilities/didManager';

//TODO
const privateEthrKey =
  '055625aecdde464cbbe6ef3ee5806ed74eafe57a01523e6a01a6d09b1c626495';

export default class DidList extends Component {
  didManager;

  constructor() {
    super();
    this.state = {
      dids: [],
      loading: true,
    };
    this.didManager = new DIDManager(() => this.updateDids());
    this.updateDids = this.updateDids.bind(this);
  }

  updateDids() {
    console.log(
      'reload',
      this.didManager.getDids().map(ethrDid => ethrDid.did),
    );
    this.setState({
      dids: this.didManager.getDids(),
      loading: false,
    });
  }

  createListItems() {
    let listItems = [];
    for (ethrDid of this.state.dids) {
      listItems.push(
        <ListItem key={ethrDid.did}>
          <Text onPress={() => ethrDid.generateSiopResponse()}>
            {ethrDid.did}
          </Text>
        </ListItem>,
      );
    }
    return listItems;
  }

  //TODO nicer laoding indicator
  render() {
    return (
      <>
        {this.state.loading ? (
          <List>
            <ListItem>
              <Text onPress={this.updateDids}>Loading...</Text>
            </ListItem>
          </List>
        ) : null}
        <List>{this.createListItems()}</List>
      </>
    );
  }
}
