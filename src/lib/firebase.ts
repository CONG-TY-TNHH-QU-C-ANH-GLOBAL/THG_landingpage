import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBQnV8nJz2EVx5bvOZHzMEcDIpZb0Lh0IQ",
    authDomain: "thg-fulfill-agent.firebaseapp.com",
    projectId: "thg-fulfill-agent",
    storageBucket: "thg-fulfill-agent.firebasestorage.app",
    messagingSenderId: "246663474313",
    appId: "1:246663474313:web:9a186a05f544e3cbf8aa58",
    measurementId: "G-RRXJE7DVYM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
