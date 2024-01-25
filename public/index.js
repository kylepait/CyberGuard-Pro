import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU8GUvAhx0k7D9Uvp5SEGl7dmb5p0W8B8",
  authDomain: "cyberguard-pro.firebaseapp.com",
  projectId: "cyberguard-pro",
  storageBucket: "cyberguard-pro.appspot.com",
  messagingSenderId: "84548542407",
  appId: "1:84548542407:web:b083b2ac0ebc9ba6c043e2",
  measurementId: "G-9ZYNLPRCBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);