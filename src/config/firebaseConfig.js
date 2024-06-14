import { firebase } from '@react-native-firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDuUXLHxWD95_ia_G8eFc1711EWC9KxnDA",
    authDomain: "alzheimer-detector-85e02.firebaseapp.com",
    projectId: "alzheimer-detector-85e02",
    storageBucket: "alzheimer-detector-85e02.appspot.com",
    messagingSenderId: "55317752719",
    appId: "1:55317752719:web:76ca33e0d5f12f2ff579fa",
    measurementId: "G-X9495JFHHQ"
  };

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);