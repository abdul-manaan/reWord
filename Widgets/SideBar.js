import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View,ActivityIndicator} from 'react-native';
import {Icon, Image} from 'react-native-elements'
// import Icons from 'react-native-vector-icons/AntDesign'
import {GetUserPersonalInfo, signOutUser} from '../data/data'

export default class SideBar extends React.Component {
    state = {
        Name:"",
        profilePic : "",
    }

    handle_signout = () => {
        signOutUser();
        this.props.navigation.navigate('Login')
    }
    navLink(nav, text) {
        if (text === "Signout"){
            return (
                <TouchableOpacity style={{height: 50}} onPress={() => this.handle_signout()}>
                    <Text style={styles.link}>{text}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={{height: 50}} onPress={() => this.props.navigation.navigate(nav)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        )
    }
    GetUserDataFromData = async () => {
        data = await GetUserPersonalInfo()
        // console.log(data[0])
        this.state.Name = data[0]
        this.state.profilePic = data[1]
    }
    render() {
        {this.GetUserDataFromData()}
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroller}>
                    <View style={styles.topLinks}>
                        <View style={styles.profile}>
                            <View style={styles.imgView}>
                                <Image style={styles.img} source={{uri: this.state.profilePic}}   PlaceholderContent={<ActivityIndicator />}/>
                            </View>
                            <View style={styles.profileText}>
                                <Text style={styles.name}>{this.state.Name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bottomLinks}>
                        <View style={styles.sideLink}>
                            <Icon name='home' color='#33caff' size={35}/>
                            <Text style={{color: 'white'}}>ll</Text>
                            {this.navLink('Main', 'Home')}
                        </View>
                        <View style={styles.sideLink}>
                            <Icon name='dashboard' color='#33caff' type="font-awesome" size={35}/>
                            <Text style={{color: 'white'}}>ll</Text>
                            {this.navLink('DashBoard', 'DashBoard')}
                        </View>
                        {/* <View style={styles.sideLink}>
                            <Icon name='person' color='#33caff' size={35}/>
                            <Text style={{color: 'white'}}>ll</Text>
                            {this.navLink('Profile', 'Profile')}
                        </View>
                        <View style={styles.sideLink}>
                            <Icon name='settings' color='#33caff' size={35}/>
                            <Text style={{color: 'white'}}>ll</Text>
                            {this.navLink('Settings', 'Settings')}
                        </View> */}
                        <View style={styles.sideLink}>
                            <Icon name='sign-out' color='#33caff' type='font-awesome' size={35}/>
                            <Text style={{color: 'white'}}>ll</Text>
                            {this.navLink('Signout', 'Signout')}
                        </View>

                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <Text style={styles.description}>reWord </Text>
                    <Text style={styles.version}>v1.0</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    },
    scroller: {
        flex: 1,
    },
    profile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#777777',
    },
    profileText: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        paddingBottom: 5,
        marginLeft: 20,
        color: 'white',
        textAlign: 'left',
    },
    imgView: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 5,
    },
    img: {
        height: 80,
        width: 80,
        borderRadius: 50,
    },
    topLinks: {
        height: 160,
        backgroundColor: '#33caff',
    },
    bottomLinks: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 450,
    },
    link: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        padding: 6,
        paddingLeft: 14,
        margin: 5,
        textAlign: 'left',
    },
    footer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'lightgray'
    },
    version: {
        flex: 1,
        textAlign: 'right',
        marginRight: 20,
        color: 'gray'
    },
    description: {
        flex: 1,
        marginLeft: 20,
        fontSize: 16,
    },
    sideLink: {
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    }
});