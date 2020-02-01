import React, {Component} from 'react';
import {Linking} from 'react-native';
import {Text, List, ListItem} from 'native-base';
import DIDManager from '../Utilities/didManager';

export default class DidList extends Component {
  didManager;

  constructor(props) {
    super(props);
    this.state = {
      dids: [],
      loading: true,
      requestToken: this.props.requestToken,
      client_id: this.props.client_id,
    };
    this.updateDids = this.updateDids.bind(this);
    this.didManager = new DIDManager();
    console.log('[DidList] requestToken', this.state.requestToken);
    console.log('[DidList] client_id', this.state.client_id);
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

  handelSIOPRequest(ethrDid) {
    console.log('[DidScreen] Generating SIOP Response');
    ethrDid
      .generateSiopResponse(this.state.requestToken)
      .then(siopResponseToken => {
        console.log(
          '[DidScreen] Received SIOP response token',
          siopResponseToken,
        );
        this.openReturnUrl(this.state.client_id, siopResponseToken);
      })
      .catch(err => console.error('[DidScreen] An error occurred', err));
  }

  //TODO Naming
  openReturnUrl(client_id, siopResponseToken) {
    let url = client_id;
    url += '/siopResponse?id_token=';
    url += siopResponseToken;
    console.log('[DidScreen] Return url: ' + url);
    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log('[DidScreen] Url is unsported: ' + url);
          } else {
            Linking.openURL(url);
          }
        })
        .catch(err => console.error('[DidScreen] An error occurred', err));
    }
  }

  createListItems() {
    let listItems = [];
    for (const ethrDid of this.state.dids) {
      listItems.push(
        <ListItem key={ethrDid.did}>
          <Text
            onPress={() =>
              this.state.requestToken ? this.handelSIOPRequest(ethrDid) : null
            }>
            {ethrDid.did}
          </Text>
        </ListItem>,
      );
    }
    return listItems;
  }

  //TODO nicer laoding indicator/request indicator
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
        {this.state.requestToken ? (
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
