// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Import Storage instead of Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZYXatDlzqOAsM-GaCYarPbNNva2O2--w",
  authDomain: "koi-the-b4e6c.firebaseapp.com",
  projectId: "koi-the-b4e6c",
  storageBucket: "koi-the-b4e6c.appspot.com",
  messagingSenderId: "645725948940",
  appId: "1:645725948940:web:ef3b0c1fd9f9bbe0fc7229",
  measurementId: "G-END4TTYHEB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the storage instance
export { storage };
