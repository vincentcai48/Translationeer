import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/analytics";

var firebaseConfig = {
  
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
