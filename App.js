import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';

import Login from './screen/Login'
import Signup from './screen/Signup'
import Users from './screen/Users'
import ChatRoom from './screen/Chat'

const Stack = createStackNavigator();


const onSignOut = () => {
  signOut(auth).catch(error => console.log('Error logging out: ', error));
};

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='Users' component={Users} 
        options={{
          headerTitle: props => <Text>Users</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={onSignOut}
              style={{
                marginRight: 10
              }}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name='Chat sRoom' component={ChatRoom} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}

// const AppNavigator = createStackNavigator(
// 	{   
//     Login:Login,
// 	  Sinup:Sinup,
//     Users:Users,
//     ChatRoom:ChatRoom,
// 	}, 
// 	{
// 		headerMode: 'none',
// 		navigationOptions: {
// 		headerVisible: false,
// 	}
// 	},
// 	{
// 		initialRouteName: "Login"
// 	}
// );
// const AppContainer = createAppContainer(AppNavigator)

// export default class App extends Component{
//   render(){
//     return <AppContainer/>
//   }
// }
