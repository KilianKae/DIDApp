import React, {Component} from 'react';
import {Text, List, ListItem} from 'native-base';
import DIDManager from '../Utilities/didManager';

export default class DidList extends Component {
  didManager;

  constructor(props) {
    super(props);
    this.state = {
      dids: [],
      loading: true,
      myIDRequest: this.props.myIDRequest,
    };
    this.updateDids = this.updateDids.bind(this);
    this.didManager = new DIDManager();
    console.log('[DidList] myIDRequest', this.state.myIDRequest);
  }

  componentDidMount() {
    console.log('[DidList] Mounted');
    this.didManager.subscribe(this.updateDids);
    this.didManager.importFromStorage();
  }

  componentWillUnmount() {
    this.didManager.unsubscribe(this.updateDids);
  }

  updateDids() {
    console.log('[DidList] Updating Dids');
    const dids = this.didManager.getDids();
    this.setState({
      dids,
      loading: false,
    });
  }

  createListItems() {
    let listItems = [];
    for (ethrDid of this.state.dids) {
      listItems.push(
        <ListItem key={ethrDid.did}>
          <Text
            onPress={() =>
              this.state.myIDRequest
                ? ethrDid.generateSiopResponse(this.state.myIDRequest.request)
                : null
            }>
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
        {this.state.myIDRequest ? (
          <List>
            <ListItem>
              <Text onPress={this.updateDids}>
                Select DID for authentication
              </Text>
            </ListItem>
          </List>
        ) : null}
        <List>{this.createListItems()}</List>
      </>
    );
  }
}
