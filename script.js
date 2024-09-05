import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

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
const db = getDatabase(app);






const sideMenu = document.querySelector("#sideMenu");

const _class_open_menu_ = document.getElementsByClassName('_openMenu_');
for (let i = 0; i < _class_open_menu_.length; i++) {
    _class_open_menu_[i].addEventListener('click', () => {
        sideMenu.style.transform = 'translateX(-16rem)';
    });
}

const _class_close_menu_ = document.getElementsByClassName('_closeMenu_');
for (let i = 0; i < _class_close_menu_.length; i++) {
    _class_close_menu_[i].addEventListener('click', () => {
        sideMenu.style.transform = 'translateX(16rem)';
    });
}


// Get the navbar element
const navbar = document.getElementById('navbar');

// Function to add/remove blur class based on scroll position
function handleScroll() {
    if (window.scrollY > 0) {
        navbar.classList.add('navbar-blur');
    } else {
        navbar.classList.remove('navbar-blur');
    }
}

// Add event listener for scrolling
window.addEventListener('scroll', handleScroll);

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};







const artworkList = document.getElementById('artwork_list_home');
const noArtworksMessage = document.getElementById('no_artworks_message_home');
const showMoreButton = document.getElementById('show_more_artwork');

let artworkKeys = [];
let artworksData = {};


function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}

// Display artworks
onValue(databaseRef(db, 'artworks'), (snapshot) => {

    artworkList.innerHTML = ''; // Clear previous list
    artworksData = snapshot.val();
// Get the "Show more" button

    if (artworksData) {
        artworkKeys = Object.keys(artworksData);

        // Limit the number of artworks to 6
        artworkKeys.slice(0, 5).forEach((key, index) => {
            const artwork = artworksData[key];
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-sm shadow-xl text-start relative';

            const img = document.createElement('img');
            img.src = artwork.imageUrl;
            img.alt = artwork.title;
            img.className = 'mb-4 mx-auto h-[250px] object-cover rounded-sm cursor-pointer';
            card.appendChild(img);

            const title = document.createElement('h3');
            title.className = 'text-2xl font-bold mb-2';
            title.textContent = capitalizeSentences(artwork.title);
            card.appendChild(title);

            const description = document.createElement('p');
            description.className = 'text-gray-600';
            description.textContent = capitalizeSentences(artwork.description);
            card.appendChild(description);

            artworkList.appendChild(card);
        });

        noArtworksMessage.style.display = 'none'; // Hide "No artworks available" message
        showMoreButton.style.display = 'flex'; // Show the "Show more" button
    } else {
        noArtworksMessage.style.display = 'block'; // Show "No artworks available" message
        showMoreButton.style.display = 'none'; // Hide the "Show more" button
    }
});
