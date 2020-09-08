import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { color } from 'react-native-reanimated';

export default class AppBar extends React.Component {
  
  _goBack = () => console.log('Went back');

  _handleSearch = () => console.log('Searching');

  _handleMore = () => console.log('Shown more');
  
  // implemented without image with header
  
  render() {
    return (
        <Appbar.Header style={{backgroundColor:'#33caff'}}>
            <Appbar.Action icon={this.props.firstTitle || "menu"} onPress={this.props.first} />
            <Appbar.Content
            title={this.props.title}
            subtitle="MDCAT"
            />
            {/* <Appbar.Action icon="magnify" onPress={this._handleSearch} /> */}
            <Appbar.Action icon="dots-vertical" onPress={this._handleMore} />
            {/* <PopupMenu actions={['Edit', 'Remove']} /> */}
        </Appbar.Header>
    )
}
}