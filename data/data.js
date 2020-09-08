import * as synonyms from './synonyms.json';
import * as antonyms from './antonyms.json';
import * as definitions from './definition.json';
import * as examples from './examples.json';
import auth, {firebase} from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';
// import {db} from '../config'
import database from '@react-native-firebase/database'
let Xyz = "12";

export const FireBaseStorage = storage();


let Name = "";
let profilePic = "";
let UserUID = "";
let appOpened = false;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}




const Get_words = (numOfWords,includePrev, numOfRevisions, startsFrom) => {
    if (Object.keys(definitions).includes("default")){
        delete definitions['default'];
    }

    let result = []
    let words = Object.keys(definitions).slice(startsFrom)
    // console.log(words)
    for(let i=0; i< numOfWords; i++){
        let word = words[i]
        let new_word = {}
        new_word['wod'] = word
        new_word['def'] = definitions[word]
        new_word['ant'] = get_antonym(word)
        new_word['syn'] = get_synonym(word)
        new_word['exm'] = examples[word] || [""]
        new_word['status'] = "New Word"
        for(let i=0; i<=numOfRevisions; i++) {
            result.push(new_word)
        }
    }
    let learnedWords = Object.keys(definitions).slice(0, startsFrom)
    if (includePrev && learnedWords.length > 5) {
        learnedWords = shuffle(learnedWords)
        for(let i=0; i< 5; i++) {
            let word = learnedWords[i]
            let new_word = {}
            new_word['wod'] = word
            new_word['def'] = definitions[word]
            new_word['ant'] = get_antonym(word)
            new_word['syn'] = get_synonym(word)
            new_word['exm'] = examples[word] || [""]
            new_word['status'] = "Revising"
        }
    }
    return shuffle(result)
};

const get_synonym = (word) => {
    // console.log(definitions)
    if (Object.keys(synonyms).includes(word) && synonyms[word].length > 0){
        return (synonyms[word].reduce(get_synonym_reduce, "")) || ""
    }
    return ""
}

const get_antonym = (word) => {
    if (Object.keys(antonyms).includes(word) && antonyms[word].length > 0){
        return (antonyms[word].reduce(get_synonym_reduce, "")) || ""
    }
    return ""
}

const get_synonym_reduce = (total, word) => {
    if (total.length> 0){
        let x = total + ',  ' + word
        return x
    } else {
        return word;
    }
}


// Signup 
const __isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const DoSignUp = async (email, password) => {
    if (!email) {
      return [false, "Email required *"]
    } else if (!password || !(password.trim()) || password.length < 8) {
      return [false, "Weak password, minimum 8 chars"]
    } else if (!__isValidEmail(email)) {
      return [false, "Invalid Email"]
    }
  
    return (await DoCreateUser(email, password))
}
  
const DoSignIn = async (email, password) => {
    try {
        // await firebase.auth().setPersistence('local')
        let response = await auth().signInWithEmailAndPassword(email, password)
        if (response && response.user) {
            return [true, "Authenticated Successfully!"]
        } 
    } catch (e) {
        console.log(e.message)
        return [false, "Authentication Failed!"]
    }
  }
  

const DoCreateUser = async (email, password) => {
    try {
        let response = await auth().createUserWithEmailAndPassword(email, password)
        if (response) {
            return [true, "Signup Successful!", response.user]
        }
    } catch (e) {
        return [false, e.message]
    }
}
const signOutUser = async () => {
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}

const UploadToDB = async (state,userUID) => {
    try{
        database().ref('/'+userUID).set({
            Name         : state.name,
            profilePic   : state.photo,
            Email        : state.email,
            Password     : state.password,
            profileUrl   : state.profileImageUrl,
        });
    }catch(e) {
        console.log(e)
    }
}

const GetUserPersonalInfo = async () => {
    try{
        UserUID = firebase.auth().currentUser.uid
        if (UserUID.length < 1 ){
            console.log("UserUID not Avail")
            return ["Not Avail", ""]
        }
        // console.log(UserUID)
        let querySnapShot = await  database().ref('/'+UserUID).once('value')
        let data = querySnapShot.val()
        if(Object.keys(data).length === 1) {
            data = data[Object.keys(data)[0]]
        }
        if (Object.keys(data).length !== 0){
            Name = data['Name'];
            profilePic = data['profileUrl']
        }
        // console.log(profilePic,Name)
        return [Name, profilePic]
    } catch(e) {
        console.log(e)
    }
} 
const GetUserData = (userUID=UserUID) => {
    UserUID = firebase.auth().currentUser.uid
    database().ref('/'+userUID).on('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        if (Object.keys(data).length !== 0){
            Name = data['Name'];
            profilePic = data['profileUrl']
        }
    });
    
}
const uploadFileToFireBase = (imagePickerResponse) => {
    const fileSource = getFileLocalPath(imagePickerResponse);
    const storageRef = createStorageReferenceToFile(imagePickerResponse);
    return storageRef.putFile(fileSource);
};

const getFileLocalPath = response => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
};

const createStorageReferenceToFile = response => {
    const { fileName } = response;
    return FireBaseStorage.ref(fileName);
};

// const UpdateLearnedWords = (words) => {
//     try{
//         console.log(UserUID)
//         words = words.map(word => word['wod'])
//         words = uniq(words)
//         words = words.concat(learnedWords)
//         learnedWords = words
//         database().ref("/"+UserUID).update({
//             learnedWords: words,
//         })
//     } catch(e) {
//         console.log(e)
//     }
// }
const uniq = (a) =>{
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

const getOptions = (word, numOfOptions) => {
    let options = []
    options.push(definitions[word])


    let def = Object.values(definitions).filter(a => a !== definitions[word] )
    def = shuffle(def)
    for(let i=1; i< numOfOptions; i++) {
        options.push(def[i])
    }

    return shuffle(options);

}
const getWordsForSet = (setNo) => {
    if (Object.keys(definitions).includes("default")){
        delete definitions['default'];
    }
    let words = []
    
    for(let i=setNo*20; i < Object.keys(definitions).length && i < setNo*20+20; i++){
        let newWord = {}
        let word = Object.keys(definitions)[i]
        newWord['word'] = word
        newWord['definition'] = definitions[word]
        newWord['options'] = getOptions(word, 4)
        newWord['ant'] = get_antonym(word)
        newWord['syn'] = get_synonym(word)
        newWord['exm'] = examples[word] || [""]
        words.push(newWord);
    }
    return words;
}

const getLearnedWordsForSet = async (setNo) => {
    try{
        UserUID = firebase.auth().currentUser.uid
        if (UserUID.length < 1 ){
            console.log("UserUID not Avail")
            return ["Not Avail", ""]
        }
        // console.log(UserUID)
        let querySnapShot = await  database().ref('/'+UserUID + '/setsData').once('value')
        let data = querySnapShot.val()
        if (!data){
            return []
        }

        data  = data[setNo] || []
        return data
    } catch(e) {
        console.log("Error in getLearnedWordsForSet",e)
    }
}

const getSetsData = async () => {
    let allSets = {}
    for(let i=0; i < Object.keys(definitions).length; i+=20){
        let setNo = (i/20);
        let newSet = {}
        newSet['totalWords'] = Math.min(Object.keys(definitions).length-i, 20)
        newSet['learned'] = (await getLearnedWordsForSet(setNo)).length

        allSets[setNo] = newSet
    }
    return allSets;
}

const updateSetData = async (setNo, word) => {
    // console.log(setNo,word)
    let allWords = await getLearnedWordsForSet(setNo)
    // console.log(allWords)
    if(allWords.length === 0){
        allWords = [word]
    }  else if(!Array.isArray(allWords)){
        allWords = [word, allWords]
    } else {
        allWords.push(word)
    }
    allWords = uniq(allWords)
    database().ref("/"+UserUID + "/setsData").update({
        [setNo]: allWords,
    })
}

const getDashboardData = async () => {
    try{
        UserUID = firebase.auth().currentUser.uid
        if (UserUID.length < 1 ){
            console.log("UserUID not Avail")
            return ["Not Avail", ""]
        }
        // console.log(UserUID)
        let querySnapShot = await  database().ref('/'+UserUID + '/setsData').once('value')
        let data = querySnapShot.val()
        let result = {}
        let totalLearnedWords = 0

        if (!data){
            totalLearnedWords = 0
        } else {
            for(let i=0; i<= 9; i++){
                let xData  = data[i] || []
                totalLearnedWords += xData.length
            }
        }

        querySnapShot = await  database().ref('/'+UserUID).once('value')
        data = querySnapShot.val()
        if(Object.keys(data).length === 1) {
            data = data[Object.keys(data)[0]]
        }

        let appOpened = 0;
        if (Object.keys(data).length !== 0){
            appOpened = data['AppOpened'] || 0;
        }


        result['totalLearnedWords'] = totalLearnedWords
        if (appOpened === undefined){
            appOpened = 1
        }
        result['appOpened'] = appOpened
        result['Resets'] = await getAppResetData()
        return result
    
    } catch(e) {
        console.log("Error in getLearnedWordsForSet",e)
    }
}

const getAppOpenedData = async () => {
    try{
        UserUID = firebase.auth().currentUser.uid
        let querySnapShot = await  database().ref('/'+UserUID).once('value')
        let data = querySnapShot.val()
        if(Object.keys(data).length === 1) {
            data = data[Object.keys(data)[0]]
        }

        let appOpened = 0;
        if (Object.keys(data).length !== 0){
            appOpened = data['AppOpened'] || 0;
        }
        return appOpened
    }catch(e) {
        console.log("Error in getLearnedWordsForSet",e)
    }
}

const getAppResetData = async () => {
    try{
        UserUID = firebase.auth().currentUser.uid
        let querySnapShot = await  database().ref('/'+UserUID).once('value')
        console.log(querySnapShot)
        let data = querySnapShot.val()
        if(Object.keys(data).length === 1) {
            data = data[Object.keys(data)[0]]
        }

        let appResets = 0;
        if (Object.keys(data).length !== 0){
            appResets = data['Resets'] || 0;
        }
        return appResets
    }catch(e) {
        console.log("Error in getLearnedWordsForSet",e)
    }
}


const updateAppOpened = async () => {
    UserUID = firebase.auth().currentUser.uid
    if(appOpened){
        return
    }
    let numOfTimes = await getAppOpenedData()
    if (numOfTimes === undefined){
        numOfTimes = 1
    }
    numOfTimes += 1
    database().ref("/"+UserUID ).update({
        AppOpened: numOfTimes,
    })
    appOpened = true;
}

const resetSetsData = async () => {
    try {
        UserUID = firebase.auth().currentUser.uid
        database().ref("/"+UserUID+"/setsData" ).remove()

        let numOfTimes = await getAppResetData()
        if (numOfTimes === undefined){
            numOfTimes = 0
        }
        numOfTimes += 1
        database().ref("/"+UserUID ).update({
            Resets: numOfTimes,
        }).catch(()=>console.log(e))
    }catch(e) {
        console.log(e)
    }
}
export{
    Xyz,
    Get_words,
    DoSignUp,
    DoCreateUser,
    DoSignIn,
    uploadFileToFireBase,
    UploadToDB,
    GetUserData,
    Name,
    profilePic,
    GetUserPersonalInfo,
    signOutUser,
    getWordsForSet,
    getSetsData,
    updateSetData,
    getLearnedWordsForSet,
    getDashboardData,
    updateAppOpened,
    resetSetsData,
    getAppResetData
}