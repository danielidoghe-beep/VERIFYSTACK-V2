import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGkyaLPlM-Osma8SDE2NvhN2alh0hwFRQ",
  authDomain: "verifystack-v2.firebaseapp.com",
  projectId: "verifystack-v2",
  storageBucket: "verifystack-v2.firebasestorage.app",
  messagingSenderId: "15261593774",
  appId: "1:15261593774:web:1318290cff934f700bbd3f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
