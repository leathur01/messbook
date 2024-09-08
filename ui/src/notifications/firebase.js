import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC1hC2KyXFkzZEWyQz_EcMKB3JiUvyf4HM",
  authDomain: "messbook-notification.firebaseapp.com",
  projectId: "messbook-notification",
  storageBucket: "messbook-notification.appspot.com",
  messagingSenderId: "1051258491539",
  appId: "1:1051258491539:web:abdb5c9931df20b595b366",
  measurementId: "G-NPERSST0LV"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);