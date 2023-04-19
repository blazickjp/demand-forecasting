// firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
    apiKey: "AIzaSyB6DA2GjE_hbLjs7mXSJn1zE8LN6C6F33o",
    authDomain: "forecasting-a76c1.firebaseapp.com",
    projectId: "forecasting-a76c1",
    storageBucket: "forecasting-a76c1.appspot.com",
    messagingSenderId: "735860310311",
    appId: "1:735860310311:web:da827fed402dac2959a902",
    measurementId: "G-ZJJ57Q5406"
};

const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, analytics, firestore };
