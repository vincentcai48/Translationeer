import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/analytics";

var firebaseConfig = {
  apiKey: "AIzaSyCrnNBi1ptWYnqXA_cNZ9FXVBpZR1zn_54",
  authDomain: "translationeer.firebaseapp.com",
  databaseURL: "https://translationeer.firebaseio.com",
  projectId: "translationeer",
  storageBucket: "translationeer.appspot.com",
  messagingSenderId: "687257894798",
  appId: "1:687257894798:web:ddb3b3488208674438aedf",
  measurementId: "G-4QH2XWC56C",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const pAuth = firebase.auth();
const pFirestore = firebase.firestore();
const pStorage = firebase.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const fbFieldValue = firebase.firestore.FieldValue;

export { pAuth, pFirestore, pStorage, fbFieldValue, googleAuthProvider };
