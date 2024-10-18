// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTQTX_OJ8HbiDtPpnV9kaQE5ENLMrCgDU",
  authDomain: "move-management-4fb2c.firebaseapp.com",
  projectId: "move-management-4fb2c",
  storageBucket: "move-management-4fb2c.appspot.com",
  messagingSenderId: "180170591511",
  appId: "1:180170591511:web:e7efb77bb8918a068dbb52",
  measurementId: "G-KS3ZPLFC40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
