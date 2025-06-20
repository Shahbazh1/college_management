// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ this is required


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHoFFtADYX8CdjHBgITgSMi_3y_AHIIoQ",
  authDomain: "collegemanagementsystem-cbcf5.firebaseapp.com",
  projectId: "collegemanagementsystem-cbcf5",
  storageBucket: "collegemanagementsystem-cbcf5.appspot.com",
  messagingSenderId: "171596500380",
  appId: "1:171596500380:web:43d09407bae60116efcc59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
export { auth,db };
