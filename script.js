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



// profile images updates .. 


const header_profile_img = document.getElementById('header_profile_img');
const skeleton_header_profile_img = document.getElementById('skeleton_header_profile_img');
const about_user_img = document.getElementById('about_user_img');
const skeleton_about_user_img = document.getElementById('skeleton_about_user_img');



onValue(databaseRef(db, 'profile'), (snapshot) => {

    const snapImages = snapshot.val();

    if (snapImages && snapImages.profile_image) {
        // Assuming the profile image URL is stored in the 'profile_image' key
        header_profile_img.src = snapImages.profile_image;
        skeleton_header_profile_img.classList.add('hidden');
        header_profile_img.classList.remove('hidden');

    } else {
        // If no image is found, set a default or placeholder image
        header_profile_img.src = 'images/profile-img.png';
        skeleton_header_profile_img.classList.add('hidden');
        header_profile_img.classList.remove('hidden');

    }


    if (snapImages && snapImages.user_image) {
        // Assuming the user image URL is stored in the 'user_image' key
        about_user_img.src = snapImages.user_image;
        skeleton_about_user_img.classList.add('hidden');
        about_user_img.classList.remove('hidden');
    } else {
        // If no image is found, set a default or placeholder image
        about_user_img.src = 'images/user-image.png';
        skeleton_about_user_img.classList.add('hidden');
        about_user_img.classList.remove('hidden');
    }


});




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
            title.className = 'text-2xl font-bold mb-2 text-wrap';
            title.textContent = capitalizeSentences(artwork.title);
            card.appendChild(title);

            const description = document.createElement('p');
            description.className = 'text-gray-600 text-wrap';
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



document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the form from redirecting

    const contact_form_submit_btn = document.getElementById('contact-form-submit-btn');
    const spinner_contact_form_submit_btn = document.getElementById('spinner-contact-form-submit-btn');

    spinner_contact_form_submit_btn.classList.remove('hidden');
    contact_form_submit_btn.querySelector('p').textContent = "Sending ... ";

    const form = event.target;
    const formData = new FormData(form);

    // Fetch the form submission URL
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        const responseMessage = document.getElementById('responseMessage');

        if (response.ok && result.success) {
            // Display success message
            spinner_contact_form_submit_btn.classList.add('hidden');

            contact_form_submit_btn.classList.add('bg-green-600');
            contact_form_submit_btn.classList.remove('bg-black/80');
            contact_form_submit_btn.querySelector('p').textContent = "Message Sent ..! Thank You.";

            form.reset(); // Clear the form after successful submission
        } else {
            // Display error message
            spinner_contact_form_submit_btn.classList.add('hidden');

            contact_form_submit_btn.classList.add('bg-red-600');
            contact_form_submit_btn.classList.remove('bg-black/80');
            contact_form_submit_btn.querySelector('p').textContent = "Oops!  Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);

        spinner_contact_form_submit_btn.classList.remove('hidden');

        contact_form_submit_btn.classList.add('bg-red-600');
        contact_form_submit_btn.classList.remove('bg-black/80');
        contact_form_submit_btn.querySelector('p').textContent = "Error: Unable to submit form.";

    }

    setTimeout(function () {
        contact_form_submit_btn.querySelector('p').textContent = "Send Message";
        contact_form_submit_btn.classList.add('bg-black/80');
        contact_form_submit_btn.classList.remove('bg-green-600');
        contact_form_submit_btn.classList.remove('bg-red-600');

    }, 3000);

});



