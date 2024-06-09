// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-ef416.firebaseapp.com",
  projectId: "reactchatapp-ef416",
  storageBucket: "reactchatapp-ef416.appspot.com",
  messagingSenderId: "544834421677",
  appId: "1:544834421677:web:2abd01105e3da772161724",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
