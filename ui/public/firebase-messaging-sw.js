/* eslint-disable no-undef */
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyC1hC2KyXFkzZEWyQz_EcMKB3JiUvyf4HM",
    authDomain: "messbook-notification.firebaseapp.com",
    projectId: "messbook-notification",
    storageBucket: "messbook-notification.appspot.com",
    messagingSenderId: "1051258491539",
    appId: "1:1051258491539:web:abdb5c9931df20b595b366",
    measurementId: "G-NPERSST0LV"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});