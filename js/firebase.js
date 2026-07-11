import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAiy21xPzKilRVxzwr6L66eNAXDq9QbZo0",
    authDomain: "sarbeswar-portfolio-ea4bc.firebaseapp.com",
    projectId: "sarbeswar-portfolio-ea4bc",
    storageBucket: "sarbeswar-portfolio-ea4bc.firebasestorage.app",
    messagingSenderId: "477862542721",
    appId: "1:477862542721:web:8f702f97d3f9560b737c80"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase Project:", app.options.projectId);
console.log("Firebase App ID:", app.options.appId);