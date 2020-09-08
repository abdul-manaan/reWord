
import * as React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import AppBar from '../Widgets/AppBar'
import ProgressCircle from 'react-native-progress-circle'
import {getDashboardData, resetSetsData} from '../data/data'

export default class DashBoard extends React.Component {
    state ={
        percent: 0,
        totalWords: 207,
        learnedWords: 0,
        numOfSessions: 0,
        numOfGamesPlayed: 0,
        numOf10WSessions: 0,
        numOf15WSessions: 0,
        numOf5WSessions: 0,
        numOfResets: 0,
    }

    componentDidMount = () => {
        this.GetDashBoardData()
    }
    GetDashBoardData = async () => {
        let data = await getDashboardData()

        let percent = data['totalLearnedWords']/207*100;
        console.log(data)
        this.setState({percent: percent, numOfSessions: data['appOpened'], learnedWords: data['totalLearnedWords'] , numOfResets : data['Resets']})
    }
    _handleReset = async () => {
        await resetSetsData()
        this.GetDashBoardData()
    }
    render() {
        // {this.GetDashBoardData()}
        return (
          <>
            <AppBar 
                navigation={this.props.navigation} 
                title="reWord" 
                first={()=>this.props.navigation.navigate('Main')}
                firstTitle="arrow-left"
                />
        <ScrollView>
            <ProgressCircle
                percent={this.state.percent}
                radius={100}
                borderWidth={15}
                color="#3399FF"
                shadowColor="#999"
                bgColor="#fff"
                outerCircleStyle={styles.ProgressCircle}
                containerStyle={styles.ProgressCircleContainer}
            >
                <Text style={{ fontSize: 30 }}>{`${this.state.learnedWords}/${this.state.totalWords}`}</Text>
            </ProgressCircle>
            <Card title="Statistics" containerStyle={styles.cardStyleBorder}>
                <ListItem
                    leftElement={<Text>Num. of Time App Opened:</Text>}
                    rightElement={<Text>{this.state.numOfSessions}</Text>}
                />
                {/* <ListItem
                    leftElement={<Text>Number of Games Played:</Text>}
                    rightElement={<Text>{this.state.numOfGamesPlayed}</Text>}
                />
                <ListItem
                    leftElement={<Text>Number of 5 words' Sessions:</Text>}
                    rightElement={<Text>{this.state.numOf5WSessions}</Text>}
                />
                <ListItem
                    leftElement={<Text>Number of 10 words' Sessions:</Text>}
                    rightElement={<Text>{this.state.numOf10WSessions}</Text>}
                />
                <ListItem
                    leftElement={<Text>Number of 15 words' Sessions:</Text>}
                    rightElement={<Text>{this.state.numOf15WSessions}</Text>}
                /> */}
                <ListItem
                    leftElement={<Text>Number of Resets:</Text>}
                    rightElement={<Text>{this.state.numOfResets}</Text>}
                />
            </Card>
            <Button
                icon={
                    <Icon
                    type="font-awesome"
                    name="refresh"
                    size={15}
                    color="white"
                    marginRight={10}
                    />
                }
                title="Reset Progress"
                onPress={this._handleReset}
                buttonStyle={styles.buttonReset}
          
            />
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
    ProgressCircle:{
        marginLeft: '25%',
        marginRight:'25%',
        marginTop:50,
    },
    ProgressCircleContainer: {
        fontSize:100,

    },
    buttonReset: {
        margin: 40,
        borderRadius: 20,
    },
    cardStyleBorder:{
        borderRadius: 10,
      }
  })