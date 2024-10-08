// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqWMvHhobgQQHscORNf2xWh5GjxiWFQIs",
  authDomain: "swp391-project-b8c0c.firebaseapp.com",
  projectId: "swp391-project-b8c0c",
  storageBucket: "swp391-project-b8c0c.appspot.com",
  messagingSenderId: "328319328477",
  appId: "1:328319328477:web:df3ba4ee6f447bf0e2bb34",
  measurementId: "G-85F9G101VK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
