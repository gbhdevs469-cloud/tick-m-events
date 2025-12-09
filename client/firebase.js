// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDggo-Hg-S0GN4PklEXnx4NVrSSFWGqzJA",
  authDomain: "event-project-57c48.firebaseapp.com",
  projectId: "event-project-57c48",
  storageBucket: "event-project-57c48.firebasestorage.app",
  messagingSenderId: "955396753441",
  appId: "1:955396753441:web:617ccbe30cca25b5923b60"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
