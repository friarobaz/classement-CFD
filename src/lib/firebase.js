// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions"
//import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASEzIElWXhxa6IlUgBVcOKHh_TnKBE8So",
  authDomain: "parapente-dbde2.firebaseapp.com",
  projectId: "parapente-dbde2",
  storageBucket: "parapente-dbde2.appspot.com",
  messagingSenderId: "274052033671",
  appId: "1:274052033671:web:f201b6db384b2e309a1c22",
  measurementId: "G-3DB972CNKR",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app)
const functions = getFunctions(app)
connectFunctionsEmulator(functions, "localhost", 5001)

export const fetchCFD = httpsCallable(functions, "fetchCFD")
