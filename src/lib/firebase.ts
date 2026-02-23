import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB6GAZuP9c7Q9MjRvPeRHTnXyK4Y1O8ShY",
    authDomain: "portfolio-willy.firebaseapp.com",
    projectId: "portfolio-willy",
    storageBucket: "portfolio-willy.firebasestorage.app",
    messagingSenderId: "423318057797",
    appId: "1:423318057797:web:bc8c16f5f481e9de23042c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
