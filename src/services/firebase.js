import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATwAnjY4LUnFyrb54JxczHr3x-3Dd4IQE",
  authDomain: "financetracker-7bc07.firebaseapp.com",
  databaseURL: "https://financetracker-7bc07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "financetracker-7bc07",
  storageBucket: "financetracker-7bc07.firebasestorage.app",
  messagingSenderId: "876727820710",
  appId: "1:876727820710:web:2dac445e81072acbda6f67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database }; 