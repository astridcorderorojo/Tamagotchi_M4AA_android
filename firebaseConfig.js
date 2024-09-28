// firebaseConfig.js
import { initializeApp } from 'firebase/app';
//import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Tu configuración de Firebase [Test...(test2) en cuenta astrid]
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios de Firebase
//const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export { app, auth, firestore, storage };