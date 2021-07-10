import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCrnNBi1ptWYnqXA_cNZ9FXVBpZR1zn_54",
  authDomain: "translationeer.web.app",
  databaseURL: "https://translationeer.firebaseio.com",
  projectId: "translationeer",
  storageBucket: "translationeer.appspot.com",
  messagingSenderId: "687257894798",
  appId: "1:687257894798:web:ddb3b3488208674438aedf",
  measurementId: "G-4QH2XWC56C",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const analytics = firebase.analytics;

const pAuth = firebase.auth();
const pFirestore = firebase.firestore();
const pStorage = firebase.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const fbFieldValue = firebase.firestore.FieldValue;

export { pAuth, pFirestore, pStorage, fbFieldValue, googleAuthProvider };
