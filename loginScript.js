import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";


const firebaseConfig = {
    apiKey: "AIzaSyDYd6u8qFV0butmjZlp7uRJ2Rkg9ag901Y",
    authDomain: "artly-4299e.firebaseapp.com",
    projectId: "artly-4299e",
    storageBucket: "artly-4299e",
    messagingSenderId: "157376089597",
    appId: "1:157376089597:web:83e437ddce62838f865d94",
    measurementId: "G-R86NZQGHRV"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const errorMessage = document.getElementById('error-message');

const login_form_submit_btn = document.getElementById('login-form-submit-btn');

const spinner_login_form_submit_btn = document.getElementById('spinner-login-form-submit-btn');


const showError = (element, message) => {
    element.textContent = message;
    element.classList.remove('hidden');

    setTimeout(() => {
        element.classList.add('hidden');
        element.textContent = '';
    }, 3000);
};


let isSubmitting = false;

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
        showError(errorMessage, "Email is required.");
        loginForm.reset();
        return;
    }

    if (!password) {
        showError(errorMessage, "Password is required.");
        loginForm.reset();
        return;
    }

    isSubmitting = true;

    spinner_login_form_submit_btn.classList.remove('hidden');


    login_form_submit_btn.querySelector('p').textContent = "Signing In ...";


    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            spinner_login_form_submit_btn.classList.add('hidden');
            loginForm.reset();
            isSubmitting = false;
             login_form_submit_btn.querySelector('p').textContent = "Sign In";
            window.location.href = "post.html";
        })
        .catch((error) => {
            login_form_submit_btn.querySelector('p').textContent = "Try Again ..!"
            login_form_submit_btn.classList.add('bg-red-600');
            login_form_submit_btn.classList.remove('bg-blue-600');
            spinner_login_form_submit_btn.classList.add('hidden');


            showError(errorMessage, error.message);
            loginForm.reset();
            isSubmitting = false;
        });



    setTimeout(function () {
        login_form_submit_btn.querySelector('p').textContent = "Sign In";
        login_form_submit_btn.classList.add('bg-blue-600');
        login_form_submit_btn.classList.remove('bg-red-600');

    }, 3000);



});
