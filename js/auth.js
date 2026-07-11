import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Login
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logout() {
  await signOut(auth);
}

// Protect admin pages
export function protectPage(loginPage = "login.html") {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = loginPage;
        }
    });
}

// Redirect logged-in users away from login page
export function redirectIfLoggedIn(dashboardPage = "dashboard.html") {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = dashboardPage;
        }
    });
}