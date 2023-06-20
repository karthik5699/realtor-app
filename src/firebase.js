// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj1MdKagp50Vb2DcbvmdtFw2iBTl5C_v8",
  authDomain: "realtor-react-2d796.firebaseapp.com",
  projectId: "realtor-react-2d796",
  storageBucket: "realtor-react-2d796.appspot.com",
  messagingSenderId: "625088044047",
  appId: "1:625088044047:web:af48507986247b44e7977a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()