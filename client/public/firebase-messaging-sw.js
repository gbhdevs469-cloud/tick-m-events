// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDggo-Hg-S0GN4PklEXnx4NVrSSFWGqzJA",
  authDomain: "event-project-57c48.firebaseapp.com",
  projectId: "event-project-57c48",
  storageBucket: "event-project-57c48.firebasestorage.app",
  messagingSenderId: "955396753441",
  appId: "1:955396753441:web:617ccbe30cca25b5923b60"
});


const messaging = firebase.messaging();
const channel = new BroadcastChannel('fcm-messages');

messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || 'New Notification';
  const options = {
    body: payload.data?.body || '',
    data: payload.data,
  };

  // Push it to the page via BroadcastChannel
  channel.postMessage({
    source: 'fcm-sw',
    payload,
  });

  self.registration.showNotification(title, options);
});
