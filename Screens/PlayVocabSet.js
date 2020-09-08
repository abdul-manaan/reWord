
import * as React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity,ScrollView, FlatList, Image, TouchableHighlight,  } from 'react-native'
import { Switch } from 'react-native-paper';
import { Card, ListItem, Button } from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import {Dropdown} from 'react-native-material-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Get_words, getWordsForSet, updateSetData,getLearnedWordsForSet} from '../data/data';

export default class PlayVocabSet extends React.Component {

    state = {
        showMeaning : false,
        words : [],
        learned : [],
        cur_pos : 0,

        isAnswerCorrect : false,
        isAnswerLearned : false,

        NewWords : [],
        Learning : [],
        Mastered : [],
        
        curWordInfo : 'New Word',

        setMastered: false,
    };
    
    get_data = async () => {
        this.state.words = getWordsForSet(this.props.navigation.getParam('setNo'));

        let learnedWords = await getLearnedWordsForSet(this.props.navigation.getParam('setNo'));
        
        let NewWords = this.state.words.filter(x => learnedWords.includes(x['word']) === false);
        let Mastered = this.state.words.filter(x => learnedWords.includes(x['word']) === true);
        if(NewWords.length === 0) {
            this.setState({setMastered: true})
            return
        }


        // this.setState({NewWords: NewWords, Mastered: Mastered});
        this.state.Mastered = Mastered
        this.state.NewWords = NewWords
        this._handleNext()
    }

    _handleNext = () => {
        let x = Math.random();
        if (this.state.NewWords.length === 0 && this.state.Learning.length === 0 ){
          //Set is Mastered
          this.setState({setMastered: true})
          return
        }
        let word = ""
        let wordState = ""
        
        console.log(this.state.Mastered.length , x)
        if (this.state.Mastered.length > 0 && x < 0.2){
          //Mastered Word
          let pos = Math.floor(Math.random() * this.state.Mastered.length); 
          word = this.state.Mastered[pos]
          wordState = "Mastered"
        }
        else if ((this.state.NewWords.length && x < 0.7) || this.state.Learning.length === 0) {
          //New Word
          let pos = Math.floor(Math.random() * this.state.NewWords.length); 
          word = this.state.NewWords[pos]
          wordState = "New Word"
        } else {
          // Learning Word
          let pos = Math.floor(Math.random() * this.state.Learning.length);
          word = this.state.Learning[pos]
          wordState = "Learning"
        }
      
        this.state.cur_pos = this.state.words.indexOf(word)

        this.setState({curWordInfo: wordState,  showMeaning: false, isAnswerCorrect:false, isAnswerLearned: false})
    }

    _handleAnswer = (optionSelected) => {
        if(this.state.words[this.state.cur_pos]['options'][optionSelected] === this.state.words[this.state.cur_pos]['definition']) {
          
          this.state.isAnswerCorrect = true

          if (this.state.Learning.includes(this.state.words[this.state.cur_pos]) === true){
            this.state.isAnswerLearned = true
            
            updateSetData(this.props.navigation.getParam('setNo'), this.state.words[this.state.cur_pos]['word'])
            let newLearning = this.state.Learning.filter(x => x != this.state.words[this.state.cur_pos])
            this.state.Learning = newLearning
            this.state.Mastered.push(this.state.words[this.state.cur_pos]);
          
          } else if (this.state.NewWords.includes(this.state.words[this.state.cur_pos]) === true){
            // console.log("Went to NewWord->Master")
            
            let newNewWords = this.state.NewWords.filter(x => x != this.state.words[this.state.cur_pos])
            this.state.NewWords = newNewWords
            let newLearning = this.state.Learning
            newLearning.push(this.state.words[this.state.cur_pos])
            this.state.Learning = newLearning
            console.log("Learning\n\n\n\n\n", this.state.Learning)
        }
         
      } else {
        
        this.state.isAnswerCorrect = false
        if (this.state.Learning.includes(this.state.words[this.state.cur_pos]) === true){
          let newLearning = this.state.Learning.filter(x => x != this.state.words[this.state.cur_pos])
          this.state.Learning = newLearning
          this.state.NewWords.push(this.state.words[this.state.cur_pos]);
        }

      }
      this.setState({showMeaning:true})

    }

    _returnHeader = (isCorrect, isLearned) => {
      if (isCorrect === true && isLearned === true){
        return(
          <Card containerStyle={{backgroundColor: '#2ce64b'}} title="Correct">
              <Text style={styles.headerStyle}>{"You have mastered this word."}</Text>
          </Card>
        );
      }
      else if (isCorrect === true) {
        return(
          <Card containerStyle={{backgroundColor:'#f2f2b6'}} title="Correct">
              <Text style={styles.headerStyle}>{"You will see this word one more time."}</Text>
          </Card>
        );
      } else {
        return(
          <Card containerStyle={{backgroundColor:'#f56e69'}} title="Incorrect">
              <Text style={styles.headerStyle}>{"You will see this word again."}</Text>
          </Card>
        );
      }
    }
    _show_meaning = () => {
        return (
            <>
            {this._returnHeader(this.state.isAnswerCorrect, this.state.isAnswerLearned)}
            <ScrollView>
                <Card title={this.state.words[this.state.cur_pos]['word']} style={styles.cardStyle}  containerStyle={styles.cardStyleBorder}>
                  <View key={2}>
                      <Text style={styles.wordStyle}>{this.state.words[this.state.cur_pos]['definition']}</Text>
                  </View>
                </Card>
                <Card title="Synonyms" titleStyle={styles.cardStyle}  containerStyle={styles.cardStyleBorder}>          
                  <View key={3}>
                      <Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['syn']}</Text>
                  </View>
                </Card>
                <Card title="Antonyms" titleStyle={styles.cardStyle}   containerStyle={styles.cardStyleBorder}>          
                  <View key={4}>
                      <Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['ant']}</Text>
                  </View>
                </Card>
                <Card title="Examples" titleStyle={styles.cardStyle}   containerStyle={styles.cardStyleBorder}>          
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

    _show_word = () => {
        return (
            <ScrollView>
                <Card title={this.state.curWordInfo} style={styles.cardStyle} containerStyle={styles.cardStyleBorder}>
                <View key={2}>
                    <Text style={styles.wordStyle}>{this.state.words[this.state.cur_pos]['word']}</Text>
                </View>
                </Card>
                <Card containerStyle={styles.cardStyleBorder}>
                    <TouchableOpacity onPress={() => this._handleAnswer(0)}>          
                        <View key={3} style={styles.meanStyle}>
                            <ListItem
                                leftElement={<Text>{'A'}</Text>}
                                title={<Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['options'][0]}</Text>}
                            />
                        </View>
                    </TouchableOpacity>
                
                    <TouchableOpacity onPress={() => this._handleAnswer(1)}>
                        <View key={3} style={styles.meanStyle}>
                            <ListItem
                                leftElement={<Text>{'B'}</Text>}
                                title={<Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['options'][1]}</Text>}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this._handleAnswer(2)}>
                        <View key={3} style={styles.meanStyle}>
                            <ListItem
                                leftElement={<Text>{'C'}</Text>}
                                title={<Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['options'][2]}</Text>}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={() => this._handleAnswer(3)}>
                        <View key={3}>
                            <ListItem
                                leftElement={<Text>{'D'}</Text>}
                                title={<Text style={styles.synonymsStyle}>{this.state.words[this.state.cur_pos]['options'][3]}</Text>}
                            />
                        </View>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        );
    }

    _showMasteredScreen = () => {
      return (
        <View style={styles.container}>
          <Image style={styles.icon} source={require("../assets/congrats.webp")} />
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.description}>You have Mastered this set.</Text>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Main')}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableHighlight>
        </View>
      )
    }
    render() {
        {if (this.state.words.length <= 0) this.get_data()}
        return (
            <>
                <AppBar 
                    navigation={this.props.navigation} 
                    title="Learning New Words" 
                    first={()=>this.props.navigation.goBack()}
                    firstTitle="arrow-left"
                />
                {(this.state.setMastered === true)?  this._showMasteredScreen():
                (this.state.showMeaning === false)? this._show_word(): this._show_meaning()}

                    {/* <Button
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
                    
                /> */}
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
  meanStyle:{
    borderBottomWidth: 1,
    borderColor: '#73999c',
    marginBottom: 10,
    marginTop: 10
  },
  headerStyle:{
    textAlign: 'center',
  },
  cardStyleBorder:{
    borderRadius: 10,
  }
})