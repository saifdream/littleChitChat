import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'dotenv/config';

// Firebase config
const config = {
    apiKey: '*',
    authDomain: '*',
    // databaseURL: '.',
    projectId: '*',
    storageBucket: '*',
    messagingSenderId: 0,
    appId: '*',
    measurementId: '*'
}

// initialize firebase
initializeApp(config);

export const auth = getAuth();
export const database = getFirestore();