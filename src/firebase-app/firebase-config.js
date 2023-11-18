import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCHz8AQCl7HoTLnKr5eJopYxV4NmOx2eqk",
    authDomain: "chats-be4cb.firebaseapp.com",
    projectId: "chats-be4cb",
    storageBucket: "chats-be4cb.appspot.com",
    messagingSenderId: "1056081166116",
    appId: "1:1056081166116:web:f0f2957ce4e7584084fdb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
