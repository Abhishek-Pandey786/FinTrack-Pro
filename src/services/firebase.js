import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyATwAnjY4LUnFyrb54JxczHr3x-3Dd4IQE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "financetracker-7bc07.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://financetracker-7bc07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "financetracker-7bc07",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "financetracker-7bc07.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "876727820710",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:876727820710:web:2dac445e81072acbda6f67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database }; 