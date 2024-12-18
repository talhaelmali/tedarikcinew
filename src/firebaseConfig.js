import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyBv3z94sBqEubk3Bg-Nl3bOMYpq8gnZKgI",
    authDomain: "ihale-6cb24.firebaseapp.com",
    projectId: "ihale-6cb24",
    storageBucket: "ihale-6cb24.appspot.com",
    messagingSenderId: "379957702128",
    appId: "1:379957702128:web:e54ce8271e2799e8308135"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
