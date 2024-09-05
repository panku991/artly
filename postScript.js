import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";
import { getDatabase, ref as databaseRef, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

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
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getDatabase(app);

// Check user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
    } else {
        // No user is signed in, redirect to login page
        window.location.href = "login.html";
    }
});

// Handle live preview updates
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewDescription = document.getElementById('preview-description');

// Function to capitalize sentences
function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}

// Update preview card in real-time
titleInput.addEventListener('input', () => {
    previewTitle.textContent = capitalizeSentences(titleInput.value) || "Artwork Title";
});

descriptionInput.addEventListener('input', () => {
    previewDescription.textContent = capitalizeSentences(descriptionInput.value) || "Artwork description";
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
            imageInput.value = ""; // Reset the input
        }
    }
});

// Handle form submission
const form = document.getElementById('artwork-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = capitalizeSentences(titleInput.value);
    const description = capitalizeSentences(descriptionInput.value);
    const file = imageInput.files[0];

    if (title && description && file) {
        // Upload image
        const imageRef = storageRef(storage, `images/${file.name}`);
        try {
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);

            // Save artwork details to the database
            const newArtworkRef = push(databaseRef(db, 'artworks'));
            await set(newArtworkRef, {
                title,
                description,
                imageUrl
            });

            alert('Artwork submitted successfully!');
            form.reset();
            previewImage.src = 'images/art_sample_1.png'; // Reset preview
        } catch (error) {
            console.error("Error uploading artwork: ", error);
            alert('Failed to submit artwork.');
        }
    } else {
        alert("Please fill out all fields and upload an image.");
    }
});

// Handle artwork list display
const artworkList = document.getElementById('artwork-list');
const noArtworksMessage = document.getElementById('no-artworks-message');

// Fetch and display artworks from the database
onValue(databaseRef(db, 'artworks'), (snapshot) => {
    artworkList.innerHTML = '';
    const artworks = snapshot.val();
    if (artworks) {
        Object.keys(artworks).forEach(key => {
            const artwork = artworks[key];
            const card = document.createElement('div');
            // card.className = 'artwork-card bg-white p-6 rounded-sm shadow-xl text-start mx-auto';
            card.className = 'bg-white p-6 rounded-sm shadow-xl text-start relative';


            const img = document.createElement('img');
            img.src = artwork.imageUrl;
            img.alt = artwork.title;
            //img.className = 'artwork-image mb-4 mx-auto';
            img.className = 'mb-4 mx-auto h-[250px] object-cover rounded-sm cursor-pointer';
            card.appendChild(img);

            const title = document.createElement('h3');
            //title.className = 'text-2xl font-bold mb-2 text-gray-800 ';
            title.className = 'text-gray-800 text-2xl font-bold mb-2';
            title.textContent = capitalizeSentences(artwork.title);
            card.appendChild(title);

            const description = document.createElement('p');
            // description.className = 'text-gray-600 ';
            description.className = 'text-gray-600';
            description.textContent = capitalizeSentences(artwork.description);
            card.appendChild(description);

            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn ';
            deleteBtn.innerHTML = `<svg fill="#ff0000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="256px" viewBox="0 0 482.428 482.429" xml:space="preserve" stroke="#ff0000" stroke-width="16.402552"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="2.894568"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path> </g> </g> </g></svg>`;
            deleteBtn.onclick = async () => {
                if (confirm('Are you sure you want to delete this artwork?')) {
                    try {
                        // Decode the URL and extract the filename
                        const decodedUrl = decodeURIComponent(artwork.imageUrl.split('?')[0]);
                        const fileName = decodedUrl.split('/').pop();
                        console.log("Deleting file:", fileName);
            
                        const imageRef = storageRef(storage, `images/${fileName}`);
                        await deleteObject(imageRef);
            
                        console.log("Removing artwork from path:", `artworks/${key}`);
                        await remove(databaseRef(db, `artworks/${key}`));
            
                        alert('Artwork deleted successfully!');
                    } catch (error) {
                        console.error("Error deleting artwork: ", error);
                        alert(`Failed to delete artwork: ${error.message}`);
                    }
                }
            };
            
            card.appendChild(deleteBtn);


            artworkList.appendChild(card);
        });
        noArtworksMessage.style.display = 'none'; // Hide message if artworks are available
    } else {
        noArtworksMessage.style.display = 'block'; // Show message if no artworks are available
    }
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = 'login.html';
    }).catch((error) => {
        // An error happened.
        console.error("Error signing out: ", error);
    });
});
