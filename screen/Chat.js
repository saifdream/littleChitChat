import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import 'firebase/database';

import { database } from '../config/firebase';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      f_id:'',
      f_name:'',
      f_email:'',
      u_id:'',
      u_name:'',
      u_email:'',
      text:'',
      chatData:[],
      data: []
    }
  }

  UNSAFE_componentWillMount= async ()=> {
      const q = query(collection(database, "chats"), orderBy('created_at', 'asc')); // , where("u_id", "==", this.props.route.params.uemail+"")
      this.unsubscribe = onSnapshot(q, (querySnapshot) => {
        let chats = querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          timestamp: Date(doc.data().created_at),
          femail: doc.data().f_email,
          fid: doc.data().f_id,
          text: doc.data().text,
          user: {
            uemail: doc.data().u_email,
            uid: doc.data().u_email
          }
        }));
        this.setState({chatData: chats});
        // console.log(chats);
      });

      this.retrieveData();
  }

  UNSAFE_componentWillUnmount() {
    this.unsubscribe();
  }

  retrieveData = async() => {
      const {fid, fname, femail, uid, uname, uemail} = this.props.route.params;
      this.setState({
        f_email:femail,
        f_id:fid,
        f_name:fname,
        u_id:uid,
        u_name:uname,
        u_email:uemail
      });
    }

  onSend=()=>{
        this.textInput.clear();
        const {fid, fname, femail, uid, uname, uemail} = this.props.route.params;

        addDoc(collection(database, 'chats'), {
            _id: uuidv4(),
            f_id: femail+"",
            f_email: femail+"",
            text: this.state.text,
            u_id: uemail+"",
            u_email: uemail+"",
            // u_name: uname
            created_at: new Date()
        });
    }

  renderDate = (date) => {
    return(
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {
    let Data=this.state.chatData;
    const {fid, fname, femail, uid, uname, uemail} = this.props.route.params;
    let chats=Data.map((c_data)=>{
        if(uemail==c_data.femail && femail==c_data.user.uemail || uemail==c_data.user.uemail && femail==c_data.femail){
              if(uemail==c_data.user.uemail){
                  return(
                    <View style={{
                      backgroundColor:"#91d0fb",
                      //padding:15,
                      marginLeft:'50%',
                      borderRadius:4,
                      marginBottom:20, 
                      width:'50%',
                      maxWidth: 500,
                      padding: 15,
                      borderRadius: 20,
                      }} key={c_data._id}>  
                    <Text style={{fontSize:16,color:"#000" }}> {c_data.text}</Text>
                    </View>
                  )
              } else{
                  return(
                    <View style={{
                      backgroundColor:"#dedede",
                      //padding:15,
                      borderRadius:4,
                      marginBottom:20, 
                      width:'50%',
                      maxWidth: 500,
                      padding: 15,
                      borderRadius: 20,
                      }} key={c_data._id}>             
                          <Text style={{fontSize:16,color:"#000" }}> {c_data.text}</Text>
                    </View>
                  )
              }
        }
      }) 

    return (
        <View style={styles.container}>
            <View style={{
                height:screenHeight - 150,
                marginVertical: 20,
                flex: 1,
                flexDirection: 'row',
                backgroundColor:"#eeeeee",
                borderRadius:10,
                padding:0,
              }}>
              <ScrollView>       
                  {chats} 
              </ScrollView>
            </View>
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.inputs}
                      placeholder="Write a message..."
                      underlineColorAndroid='transparent'
                      ref={input => { this.textInput = input }}
                      onChangeText={(msg) => this.setState({text:msg})}/>
                </View>
                <TouchableOpacity style={styles.btnSend} onPress={this.onSend}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  list:{
    paddingHorizontal: 17,
  },
  footer:{
    flexDirection: 'row',
    height:60,
    backgroundColor: '#eeeeee',
    paddingHorizontal:10,
    padding:5,
  },
  btnSend:{
    backgroundColor:"#11BFFF",
    width:40,
    height:40,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    padding: 10
  },
  iconSend:{
    width:30,
    height:30,
    alignSelf:'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    height:40,
    flexDirection: 'row',
    alignItems:'center',
    flex:1,
    marginRight:10,
  },
  inputs:{
    height:40,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
    maxWidth: 500,
    padding: 15,
    borderRadius: 20,
    
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize:12,
    color:"#808080",
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor:"#eeeeee",
    borderRadius:50,
    padding:5,
  },
})