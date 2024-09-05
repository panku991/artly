import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYd6u8qFV0butmjZlp7uRJ2Rkg9ag901Y",
    authDomain: "artly-4299e.firebaseapp.com",
    projectId: "artly-4299e",
    storageBucket: "artly-4299e.appspot.com",
    messagingSenderId: "157376089597",
    appId: "1:157376089597:web:83e437ddce62838f865d94",
    measurementId: "G-R86NZQGHRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service




const SignIn_Submit = document.getElementById("SignIn_Submit");

SignIn_Submit.addEventListener('click', (event) => {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            window.location.href = "post.html"
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });



})





