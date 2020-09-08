
import * as React from 'react';
import { View, Text,  StyleSheet, TextInput, Alert } from 'react-native'
import { Switch } from 'react-native-paper';
import { Card, ListItem, Button } from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import {Dropdown} from 'react-native-material-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Xyz} from '../data/data'

export default class LearnWords extends React.Component {
  
  _goBack = () => console.log('Went back');

  _handleStart = () => { 
    if (this.state.value >= 0 && this.state.value < (207-this.state.numOfWords)){
      this.props.navigation.navigate('LearnCard', {numOfWords: this.state.numOfWords, includePrev: this.state.includePrev, startFrom: this.state.value})
    }else {
      Alert.alert("Incorrect value in \"Starts Words From\" input box")
    }
  }
  _handleMore = () => console.log('Shown more');
  
  _data = [{
    value: 5,
  }, {
    value: 10,
  }, {
    value: 15,
  }];

  onChangeHandler = (value) => {
    this.setState({numOfWords: value})
  }
  // implemented without image with header
  _returnDropdown = () =>{
    return (  
      <Dropdown
        label='Number of Words:'
        data={this._data}
        value={5}
        onChangeText={value => this.onChangeHandler(value)}
    />
    );
  }
  state = {
    isSwitchOn: false,
    value: 0,
    numOfWords: 5,
    includePrev: false,
  };
  _onToggleSwitch = () => this.setState(state => ({ includePrev: !state.includePrev }));
  
  render() {
    {console.log(Xyz)}
    const { includePrev } = this.state;
    return (
      <>
        <AppBar 
            navigation={this.props.navigation} 
            title="Learning New Words" 
            first={()=>this.props.navigation.goBack()}
            firstTitle="arrow-left"
            />
        <Card title="Before you start," style={styles.cardStyle} containerStyle={styles.cardStyleBorder}>
            <View key={1}>
                {this._returnDropdown()}
            </View>
              <ListItem
                style={styles.txtSwitch}
                title={<Text style={styles.txtSwitch}>Include Previous Words:</Text>}
                rightElement={<Switch
                  value={includePrev}
                  onValueChange={this._onToggleSwitch}
                />}
              />
              <ListItem
                style={styles.txtSwitch}
                title={<Text style={styles.txtSwitch}>Start words from:</Text>}
                rightElement={<TextInput
                  style={{ width:60,height: 40, borderColor: 'gray', borderWidth: 1 }}
                  onChangeText={text => this.setState({value:text})}
                  value={this.state.value}
                  keyboardType="decimal-pad"
                  defaultValue={0}
                />}
              />
        </Card>
        <Button
          icon={
            <Icon
              name="arrow-right"
              size={15}
              color="white"
            />
          }
          title="Let's Start!"
          buttonStyle={styles.buttonStart}
          onPress={this._handleStart}
        />
    </>
    );
  }
}
const styles = StyleSheet.create({
  textStyle:{
      textAlign: 'left',
  },
  cardStyle:{
    textAlign: 'left',
  },
  buttonStart:{
    color:'red',
    // marginLeft: 20,
    // marginRight: 20,
    margin:30,
    borderRadius: 20,
  },
  txtSwitch:{
    color:'grey',
    fontSize:17,
    marginLeft:-8,
  },
  cardStyleBorder: {
    borderRadius: 20,
  }
})