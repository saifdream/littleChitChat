import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
  } from 'react-native';
const screenWidth = Math.round(Dimensions.get('window').width);

import {
  collection,
  query,
  onSnapshot, where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { auth, database } from '../config/firebase';


export default class Users extends Component {
  constructor(){
    super()
    this.state={
      chat_users:[],
      uid:'',
      uname:'',
      uemail:''
    }
  }
  componentWillMount=()=>{
    this._retrieveData()  
    this.getUserData()
  }

  _retrieveData = async () => {
    let u_id = auth?.currentUser?._id;
    let u_name = auth?.currentUser?.name;
    let u_email = auth?.currentUser?.email;

    this.setState({
          uid: u_id,
          uname: u_name,
          uemail: u_email
       })
    }

  componentDidMount=()=>{
    console.log(
      'uid2=> '+this.state.uid+
      '  username2=> '+this.state.uname+
      '  useremail2=> '+this.state.uemail
    )
  }


  getUserData=()=>{
    const q = query(collection(database, "chat_users"), where("email", "!=", auth?.currentUser?.email+""));
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      let users = querySnapshot.docs.map(doc => ({
        email: doc.data().email,
      }));

      this.setState({chat_users: users});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    let Data=this.state.chat_users
    let User=Data.map((u_data)=>{
        return(
          <View style={styles.backarrow} key={u_data.email}>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('ChatRoom',{
                    uemail:this.state.uemail,
                    uid:this.state.uid,
                    uname:this.state.uname,
                    fid:u_data.uid,
                    fname:u_data.name,
                    femail:u_data.email
                })}>
                <View style={styles.list}  >
                      <View style={ styles.forwidth_right}> 
                          <Text style={ styles.carname}> {u_data.email}</Text> 
                      </View>
                  </View>
              </TouchableOpacity>
            </View>

        )
      })
    return (
      <View style={styles.container}>
          <View style={styles.home_padding}>
              <ScrollView>
                  {User}
              </ScrollView>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  backarrow: {
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#e9f7f7'
  },
  top_header: {
    backgroundColor: "#ffffff",
    padding:10,
    flexDirection: 'row',
},
nav_icon: {
    width:40,
    height:40,
},
search_header: {
    width: screenWidth - 100,
    flexDirection: 'row',
},
search_icon: {
    width:30,
    height:30,
    margin:5,
},
home_padding: {
    padding:10,
    backgroundColor: "#ffffff",	
    flex: 1
},
list_img: {
    width:'100%',
    height:115,
    marginRight: 4,
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
},
forwidth_left:{
         width:'30%',
         //paddingBottom:30
    },
    forwidth_right:
    {width:'100%'
},
carname:{color: '#010000',fontSize: 16,}, 
     list_img: {
		width:'100%',
		height:115,
		marginRight: 4,
		borderTopLeftRadius:8,
		borderTopRightRadius:8,
    },
    list:{
      width: '100%',
    flexDirection: 'row',
    borderBottomColor:'#e3e3e1',
     // borderBottomWidth:2 ,
     paddingTop:0,
    paddingBottom:0,
    
		//marginTop: 3,
		//width: screenWidth / 2 - 30,
		//marginRight: 20		
	},
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})