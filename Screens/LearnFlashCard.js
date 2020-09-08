
import * as React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity,ScrollView, FlatList, Image, TouchableHighlight,  } from 'react-native'
import { Switch } from 'react-native-paper';
import { Card, ListItem, Button } from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import {Dropdown} from 'react-native-material-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Get_words} from '../data/data';

export default class LearnFlashcard extends React.Component {
  
  _goBack = () => console.log('Went back');

  _handleSearch = () => console.log('Searching');

  _handleMore = () => console.log('Shown more');
  
  _data = [{
    value: 5,
  }, {
    value: 10,
  }, {
    value: 15,
  }];
  onChangeHandler = (value) => {
    console.log(`Selected value: ${value}`);
  }

  state = {
    words: [],
    viewMeaning: false,
    cur_pos: 0,
    revisionNo : 0,
    totalRevisions: 2,
    completed: false,
  };
  _onToggleSwitch = () => this.setState(state => ({ isSwitchOn: !state.isSwitchOn }));
  _showCongrats = () => {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require("../assets/congrats.webp")} />
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.description}>You have learned {this.props.navigation.getParam('numOfWords')} new words.</Text>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Main')}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }
  _showMeaning = () => {
    return (
      <>
      <ScrollView>
          <Card title={this.state.words[this.state.cur_pos]['wod']} style={styles.cardStyle}>
            <View key={2}>
                <Text style={styles.wordStyle}>{this.state.words[this.state.cur_pos]['def']}</Text>
            </View>
          </Card>
          <Card title="Synonyms" titleStyle={styles.cardStyle}>          
            <View key={3}>
                <Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['syn']}</Text>
            </View>
          </Card>
          <Card title="Antonyms" titleStyle={styles.cardStyle}>          
            <View key={4}>
                <Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['ant']}</Text>
            </View>
          </Card>
          <Card title="Examples" titleStyle={styles.cardStyle}>          
            <View key={4}>
                {/* <Text style={styles.synonymsStyle}>{this.state.}</Text> */}
              <FlatList
                data={this.state.words[this.state.cur_pos]['exm']}
                renderItem={({item}) => <Text>{item.id}. {item}</Text>}
              />
            </View>
          </Card>
        
      </ScrollView>
          <Button
          icon={
            <Icon
              name="arrow-right"
              size={15}
              color="white"
            />
          }
          title="Next"
          onPress={this._handleNext}
          buttonStyle={styles.buttonStart}
          
        />
        </>
      );
  }
  get_data = () => {
    if (this.state.words.length > 0 ){
      return;
    }
    console.log(parseInt(this.props.navigation.getParam('startFrom')))
    let _words = Get_words(parseInt(this.props.navigation.getParam('numOfWords')), this.props.navigation.getParam('includePrev'),this.state.totalRevisions, parseInt(this.props.navigation.getParam('startFrom')))
    this.state.words =  _words
    console.log(_words)
  }
  _handleNext = () => {
    if (this.state.cur_pos+1 ===  this.state.words.length) {
          this.setState({completed: true, viewMeaning: false})
          // this.props.navigation.navigate('Main')
    } else {
      this.setState({cur_pos: this.state.cur_pos+1,viewMeaning:false})
    }
  }
  _viewMeaningHandler = () => {
    this.setState({viewMeaning: true})
  }
  render() {
    const { isSwitchOn } = this.state;
    {this.get_data()}
    // {console.log(this.props.navigation.getParam('numOfWords'),this.props.navigation.getParam('includePrev'))}
    return (
      <>
        <AppBar 
            navigation={this.props.navigation} 
            title="Learning New Words" 
            first={()=>this.props.navigation.goBack()}
            firstTitle="arrow-left"
            />
        {(this.state.viewMeaning === false && this.state.completed !== true)?  
          <Card title="New Word" style={styles.cardStyle} containerStyle={styles.cardStyleBorder}>
                <View key={1}>
                  <Text style={styles.wordStyle}>{this.state.words[this.state.cur_pos]['wod']}</Text>
                </View>
              <View>  
                  <TouchableOpacity onPress={this._viewMeaningHandler}>
                      <Text style={styles.textBelowWord}> tap to see the meaning</Text>
                  </TouchableOpacity>
              </View>
          </Card>
        : ((this.state.completed !== true)?
          this._showMeaning():
          this._showCongrats()) }
        {/* {(this.state.viewMeaning === false) || ()} */}
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
    borderRadius: 20,
    margin:40,
  },
  txtSwitch:{
    color:'grey',
    fontSize:17,
    marginLeft:-8,
  },
  wordStyle:{
      textAlign:'center',
      color:'black',
      fontSize:25,
  },
  textBelowWord: {
      textAlign:'center',
      color: 'grey',
      margin: 20,
  },
  synonymsStyle: {
    fontSize:18,
  },
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    paddingTop:50,
  },
  icon:{
    width:400,
    height:200,
  },
  title:{
    fontSize:24,
    textAlign: 'center',
    marginTop:22,
    color: "#5F6D7A"
  },
  description: {
    marginTop:20,
    textAlign: 'center',
    color: "#A9A9A9",
    fontSize:16,
    margin:40,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize:20,
  },
  cardStyleBorder: {
    borderRadius: 20,
  }
})