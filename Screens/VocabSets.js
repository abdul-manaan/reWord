
import * as React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, Alert, ListView } from 'react-native'
import { Card , ListItem} from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import Icon from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import {getSetsData} from '../data/data'

export default class VocabSets extends React.Component {
  
  state = {
    sets: {}
  }
  _handleLearnNewWords = (setNo) => this.props.navigation.navigate('PlayVocabSet',{'setNo':setNo})

  _handleData = async () => {
    let data = await getSetsData()
    // this.state.sets = data
    this.setState({sets: data})
    // console.log(this.state.sets[0])
  }
  render() {
    {this._handleData()}
    return (
      <>
        <AppBar 
            navigation={this.props.navigation} 
            title="reWord" 
            first={()=>this.props.navigation.goBack()}
            firstTitle="arrow-left"
            />
        <ScrollView>
        {Object.keys(this.state.sets).map(setNo =>   
            <TouchableOpacity onPress={() => this._handleLearnNewWords(parseInt(setNo))}>
                <Card containerStyle={styles.cardStyle}>
                    <View key={2}>
                        <ListItem
                            title={<Text style={styles.textStyle}>{`Set ${setNo}`}</Text>}
                            // rightIcon={{name:'check', color:'green'}}
                            rightElement={ (this.state.sets[parseInt(setNo)]['totalWords'] - this.state.sets[parseInt(setNo)]['learned'] === 0) ? <Icon size={25} color="green" name="checkcircle"/>:<></>}
                        />
                        <Text style={{marginTop:10, marginBottom:5,}}>{`${this.state.sets[setNo]['learned']} out of ${this.state.sets[setNo]['totalWords']} words are completed`}</Text>
                        <Progress.Bar progress={this.state.sets[parseInt(setNo)]['learned']/this.state.sets[parseInt(setNo)]['totalWords']} width={300} height={15} color={"#777777"} borderRadius={20}/>
                    </View>
                    {/* <View style={{margin:20}}>
                        <Text style={styles.textStyle1}>{'Start this set > '}</Text>
                    </View> */}
                </Card>
            </TouchableOpacity>)}
        </ScrollView>
    </>
    );
  }
}
const styles = StyleSheet.create({
    textStyle1:{
        textAlign: 'center',
        // width: 20,
        fontSize: 15,
    },
    textStyle:{
      textAlign: 'center',
      fontSize: 20,
  },
  cardStyle:{
    borderRadius: 10,
  }
})