
import * as React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, Alert, BackHandler} from 'react-native'
import { Card } from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import {updateAppOpened} from '../data/data'
export default class MainScreen extends React.Component {
    state = {
        appOpened :false
    }
    componentDidMount = () => {
        if (this.state.appOpened === false){
            updateAppOpened()
            this.state.appOpened = true
        } 
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    handleBackButton = () => {
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

        return true;
    };

    _spring = () => {
        this.setState({backClickCount: 1})
    }
  _goBack = () => console.log('Went back');

  _handleSearch = () => console.log('Searching');

  _handleMore = () => console.log('Shown more');
  
  _handleReviseWords = () => this.props.navigation.navigate('Learn');
  // implemented without image with header
  _handlePressGame = () => Alert.alert('Coming Soon ... ')
  _handleLearnSets = () => this.props.navigation.navigate('VocabSets')
  render() {
    return (
      <>
        <AppBar 
            navigation={this.props.navigation} 
            title="reWord" 
            first={()=>this.props.navigation.toggleDrawer()}
            firstTitle="menu"
            />
        <TouchableOpacity onPress={this._handleLearnSets}>
            <Card title="Learn New Words"  containerStyle={styles.cardStyleBorder}>
                <View key={3}>
                    <Text style={styles.textStyle}>{'Let\'s Start'}</Text>
                </View>
            </Card>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handleReviseWords}>
            <Card title="Revise Words"  containerStyle={styles.cardStyleBorder}>
                <View key={1}>
                    <Text style={styles.textStyle}>{'FlashCards'}</Text>
                </View>
            </Card>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handlePressGame}>
            <Card title="Play a Game"  containerStyle={styles.cardStyleBorder}>
                <View key={1}>
                    <Text style={styles.textStyle}>{'Time Limit'}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    </>
    );
  }
}
const styles = StyleSheet.create({
  textStyle:{
      textAlign: 'center',
  },
  cardStyleBorder:{
    borderRadius: 10,
  }
})