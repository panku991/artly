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


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}

const artworkList = document.getElementById('artwork-list');
const noArtworksMessage = document.getElementById('no-artworks-message');
const fullViewModal = document.getElementById('full-view-modal');
const fullViewImage = document.getElementById('full-view-image');
const fullViewTitle = document.getElementById('full-view-title');
const fullViewDescription = document.getElementById('full-view-description');
const closeModal = document.getElementById('close-modal');
const downloadArtwork = document.getElementById('download-artwork');

let currentArtworkIndex = 0;
let artworkKeys = [];
let artworksData = {};

function updateFullView(index) {
    const artwork = artworksData[artworkKeys[index]];
    fullViewImage.src = artwork.imageUrl;
    fullViewTitle.textContent = capitalizeSentences(artwork.title);
    fullViewDescription.textContent = capitalizeSentences(artwork.description);
    fullViewImage.alt = artwork.title;
    downloadArtwork.href = artwork.imageUrl;

}



let inFullViewModel = false;

function openFullViewModal(index) {
    currentArtworkIndex = index;
    updateFullView(currentArtworkIndex);
    fullViewModal.classList.remove('hidden');

}

function closeFullViewModal() {
    fullViewModal.classList.add('hidden');

}


onValue(databaseRef(db, 'artworks'), (snapshot) => {
    artworkList.innerHTML = '';
    artworksData = snapshot.val();
    if (artworksData) {
        artworkKeys = Object.keys(artworksData);
        artworkKeys.forEach((key, index) => {
            const artwork = artworksData[key];
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-sm shadow-xl text-start relative';
            card.onclick = () => openFullViewModal(index);

            const img = document.createElement('img');
            img.src = artwork.imageUrl;
            img.alt = artwork.title;
            img.loading = "lazy";
            img.className = 'mb-4 mx-auto h-[250px] object-cover rounded-sm cursor-pointer';
            //img.onclick = () => openFullViewModal(index);
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
        noArtworksMessage.style.display = 'none';
    } else {
        noArtworksMessage.style.display = 'block';
    }
});


closeModal.onclick = closeFullViewModal;


