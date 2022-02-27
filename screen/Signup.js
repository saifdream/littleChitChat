import React,{Component} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView} from 'react-native'

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";

import { auth, database } from '../config/firebase';

export default class Login extends Component{
    state = {
        name: '',
        email: '',
        password: '',
    }
    
    onPressCreate = async () => {
        this.onHandleSignup()
    }

    onHandleSignup = () => {
        const {name, email, password} = this.state;
        if (email !== '' && password !== '') {
        createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
                console.log('Signup success');
                const user = res.user;
                addDoc(collection(database, "users"), {
                    uid: user.uid,
                    name,
                    authProvider: "local",
                    email,
                    created_at: new Date()
                });
            })
            .catch(err => alert(`Signup err: ${err}`));
        }
    };
    
    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });
    onChangeTextName = name => this.setState({ name });
    
    render(){
            return(
                <View style={styles.container}>
                    <ScrollView>
                        <Text style={{fontSize: 24, margin: 'auto', paddingTop: 65, paddingBottom: 20}}>Little Chit Chat Signup</Text>
                        <View style={styles.padding_btm}>
                                <TextInput style = {styles.input} 
                                    keyboardType='email-address' 
                                    placeholder='Email or Mobile Num' 
                                    onChangeText={this.onChangeTextEmail}
                                    value={this.state.email}
                                />
                                <TextInput style = {styles.input}   
                                    placeholder='Password' 
                                    onChangeText={this.onChangeTextPassword}
                                    value={this.state.password}
                                    />
                                <TextInput style = {styles.input}   
                                    placeholder='Name'
                                    onChangeText={this.onChangeTextName}
                                    value={this.state.name} 
                                    //secureTextEntry
                                    />
                                <TouchableOpacity style={styles.buttonContainer} onPress={this.onPressCreate}>
                                    <Text  style={styles.buttonText}>CREATE ACCOUNT</Text>
                                </TouchableOpacity> 

                                <TouchableOpacity style={{padding: 20}} onPress={()=> this.props.navigation.goBack()}>
                                    <Text style={{margin: 'auto'}}>Go Back</Text>
                                </TouchableOpacity> 
                        </View>
                    </ScrollView>
            </View>
            )
        }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }, 
    loginbox:{
         flex: 1,
        borderRadius: 4,
        paddingTop:200,
        paddingBottom:2   
      },
    padding_btm: {
        padding: 20,
        },
    input:{
           height: 40,
           backgroundColor: '#e3f8fa',
           marginBottom: 10,
           padding: 10,
           color: '#000505'
       },
    buttonContainer:{
           backgroundColor: '#2980b6',
           paddingVertical: 15
       },
    buttonText:{
           color: '#fff',
           textAlign: 'center',
           fontWeight: '700'
       }
})