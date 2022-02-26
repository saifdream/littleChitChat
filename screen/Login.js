import React,{Component} from 'react';
import { View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getRedirectResult, FacebookAuthProvider } from 'firebase/auth';
import { doc, getDoc, collection, setDoc } from "firebase/firestore";
import { auth, database } from '../config/firebase';


export default class Login extends Component{
    constructor(){
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            user_Data:'',
            uid:'',
            username:'',
            uemail:''
        };
    }

  onPressLogin = async () => {
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      avatar: this.state.avatar,
    };

    this.onHandleLogin();
  }

  onHandleLogin = () => {
      if (this.state.email !== '' && this.state.password !== '') {
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
          .then((res) => {
                console.log('Login success');
                getDoc(doc(database, "chat_users", this.state.email)).then(docSnap => {
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                    } else {
                        console.log("No such document!");
                        const usersRef = collection(database, "chat_users");
                        setDoc(doc(usersRef, this.state.email), {
                            email: this.state.email,
                            created_at: new Date()
                        });
                    }
                });
          })
          .catch(err => alert(`Login err: ${err}`));
      }
  };

  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });

  onFacebook = () => {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    provider.addScope('email');
    provider.addScope('public_profile');

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        const user = result.user;
        // console.log(user);
        getDoc(doc(database, "chat_users", user.email)).then(docSnap => {
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
                const usersRef = collection(database, "chat_users");
                setDoc(doc(usersRef, user.email), {
                    email: user.email,
                    created_at: new Date()
                });
            }
        });
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        // ...
      });
  }

  onGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // console.log(user);

        getDoc(doc(database, "chat_users", user.email)).then(docSnap => {
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
                const usersRef = collection(database, "chat_users");
                setDoc(doc(usersRef, user.email), {
                    email: user.email,
                    created_at: new Date()
                });
            }
        });
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
    
  render() {
        return(
            <View style={styles.container}>
                <ScrollView>
                    <Text style={{fontSize: 24, margin: 'auto', paddingTop: 65, paddingBottom: 20}}>Little Chit Chat Login</Text>
                    <View style={styles.padding_btm}>
                        <TextInput style = {styles.input} 
                            keyboardType='email-address' 
                            placeholder='Email or Mobile Num'
                            onChangeText={this.onChangeTextEmail}
                            value={this.state.email} 
                        />

                        <TextInput style = {styles.input}   
                            placeholder='Password' 
                            secureTextEntry
                            onChangeText={this.onChangeTextPassword}
                            value={this.state.password}
                            /> 
                    
                        <TouchableOpacity style={styles.buttonContainer} onPress={this.onPressLogin}>
                            <Text  style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate("Signup")}>
                            <Text  style={styles.buttonText}>CREATE ACCOUNT NOW</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={this.onGoogle}>
                            <Text  style={styles.buttonText}>Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={this.onFacebook}>
                            <Text  style={styles.buttonText}>Facebook</Text>
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
        buttonPadding: {
        padding: 10,
        },
    input:{
           height: 40,
           backgroundColor: '#e3f8fa',
           marginBottom: 10,
           padding: 10,
           color: '#000505'
       },
    buttonContainer:{
        paddingTop:20,
           backgroundColor: '#2980b6',
           paddingVertical: 15,
           marginBottom: 15,
       },
    buttonText:{
           color: '#fff',
           textAlign: 'center',
           fontWeight: '700'
       }
})