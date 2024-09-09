import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";
import { getDatabase, ref as databaseRef, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";


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
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getDatabase(app);


onAuthStateChanged(auth, (user) => {
    if (user) {

    } else {
        window.location.href = "login.html";
    }
});

const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewDescription = document.getElementById('preview-description');


function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}


titleInput.addEventListener('input', () => {
    previewTitle.textContent = capitalizeSentences(titleInput.value) || "Artwork Title";
});

descriptionInput.addEventListener('input', () => {
    previewDescription.textContent = capitalizeSentences(descriptionInput.value) || "Artwork description";
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
            imageInput.value = "";
        }
    }
});


const form = document.getElementById('artwork-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const upload_artwork_btn = document.getElementById('upload-artwrok-btn');
    const spinner_upload_artwork_btn = document.getElementById('spinner-upload-artwork-btn')

    upload_artwork_btn.disabled = true;
    spinner_upload_artwork_btn.classList.remove('hidden');

    const title = capitalizeSentences(titleInput.value);
    const description = capitalizeSentences(descriptionInput.value);
    const file = imageInput.files[0];

    if (title && description && file) {
        try {


            upload_artwork_btn.querySelector('p').textContent = "Uploading Artwork ...";

            const newArtworkRef = push(databaseRef(db, 'artworks'));
            const artworkKey = newArtworkRef.key;

            const imageRef = storageRef(storage, `images/${artworkKey}`);

            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);

            await set(newArtworkRef, {
                title,
                description,
                imageUrl
            });

            upload_artwork_btn.querySelector('p').textContent = "Successfully Uploaded"
            upload_artwork_btn.classList.add('bg-green-600');
            upload_artwork_btn.classList.remove('bg-blue-600');

            form.reset();
            previewImage.src = 'images/art_sample_1.png';
            previewTitle.textContent = "Artwork Title";
            previewDescription.textContent = "Artwork description";
        } catch (error) {
            upload_artwork_btn.querySelector('p').textContent = "Try Again ..!"
            upload_artwork_btn.classList.add('bg-red-600');
            upload_artwork_btn.classList.remove('bg-blue-600');

            console.error("Error uploading artwork: ", error);
            alert('Failed to submit artwork.');

        }
    } else {
        alert("Please fill out all fields and upload an image.");
    }

    setTimeout(function () {
        upload_artwork_btn.querySelector('p').textContent = "Upload Image";
        upload_artwork_btn.classList.add('bg-blue-600');
        upload_artwork_btn.classList.remove('bg-green-600');
        upload_artwork_btn.classList.remove('bg-red-600');

    }, 3000);

    upload_artwork_btn.disabled = false;
    spinner_upload_artwork_btn.classList.add('hidden');

});



const artworkList = document.getElementById('artwork-list');
const noArtworksMessage = document.getElementById('no-artworks-message');

onValue(databaseRef(db, 'artworks'), (snapshot) => {
    artworkList.innerHTML = '';
    const artworks = snapshot.val();
    if (artworks) {
        Object.keys(artworks).forEach(key => {
            const artwork = artworks[key];
            const card = document.createElement('div');

            card.className = 'bg-white p-6 rounded-sm shadow-xl text-start relative';


            const img = document.createElement('img');
            img.src = artwork.imageUrl;
            img.alt = artwork.title;
            img.loading = "lazy";
            img.className = 'mb-4 mx-auto h-[250px] object-cover rounded-sm cursor-pointer';
            card.appendChild(img);

            const title = document.createElement('h3');
            title.className = 'text-gray-800 text-2xl font-bold mb-2 text-wrap';
            title.textContent = capitalizeSentences(artwork.title);
            card.appendChild(title);

            const description = document.createElement('p');
            description.className = 'text-gray-600 text-wrap';
            description.textContent = capitalizeSentences(artwork.description);
            card.appendChild(description);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn ';
            deleteBtn.innerHTML = `<svg fill="#ff0000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="256px" viewBox="0 0 482.428 482.429" xml:space="preserve" stroke="#ff0000" stroke-width="16.402552"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="2.894568"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path> </g> </g> </g></svg>`;
            deleteBtn.onclick = async () => {
                if (confirm('Are you sure you want to delete this artwork?')) {
                    try {
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
        noArtworksMessage.style.display = 'none';
    } else {
        noArtworksMessage.style.display = 'block';
    }
});


document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});






const upload_profile_image_btn = document.getElementById('upload-profile-image-btn');
const upload_user_image_btn = document.getElementById('upload-user-image-btn');

const profile_image_input = document.getElementById('profile-image-input');
const user_image_input = document.getElementById('user-image-input');
const preview_profile_image = document.getElementById('profile-image-preview');
const preview_user_image = document.getElementById('user-image-preview');


const spinner_upload_profile_image_btn = document.getElementById('spinner-upload-profile-image-btn');
const spinner_upload_user_image_btn = document.getElementById('spinner-upload-user-image-btn');


profile_image_input.addEventListener('change', () => {
    const file = profile_image_input.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                preview_profile_image.src = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
            profile_image_input.value = "";
        }
    }
});


user_image_input.addEventListener('change', () => {
    const file = user_image_input.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                preview_user_image.src = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
            user_image_input.value = "";
        }
    }
});



upload_profile_image_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    spinner_upload_profile_image_btn.classList.remove('hidden');
    upload_profile_image_btn.querySelector('p').textContent = "Uploading ...";

    const file = profile_image_input.files[0];

    if (file) {
        try {
            const fileExtension = file.name.split('.').pop();

            const imageRef = storageRef(storage, `profile_images/profile_img`);

            try {
                await deleteObject(imageRef);
                console.log("Previous profile image deleted.");
            } catch (error) {
                console.log("No existing profile image found or error deleting image:", error);
            }

            await uploadBytes(imageRef, file);

            const imageUrl = await getDownloadURL(imageRef);

            const profileRef = databaseRef(db, 'profile/profile_image');
            await set(profileRef, imageUrl);

        } catch (error) {
            console.error("Error uploading profile image: ", error);
            alert('Failed to upload profile image.');
        }
    } else {
        alert("Please select an image to upload.");
    }

    spinner_upload_profile_image_btn.classList.add('hidden');
    upload_profile_image_btn.querySelector('p').textContent = "Successfully Uploaded!";
    profile_image_input.value = '';
    upload_profile_image_btn.classList.add('bg-green-600');
    upload_profile_image_btn.classList.remove('bg-blue-600');


    setTimeout(function () {
        upload_profile_image_btn.querySelector('p').textContent = "Upload Image";
        upload_profile_image_btn.classList.add('bg-blue-600');
        upload_profile_image_btn.classList.remove('bg-green-600');
    }, 3000);

});




upload_user_image_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    spinner_upload_user_image_btn.classList.remove('hidden');
    upload_user_image_btn.querySelector('p').textContent = "Uploading ...";


    const file = user_image_input.files[0];

    if (file) {
        try {
            const fileExtension = file.name.split('.').pop();

            const imageRef = storageRef(storage, `profile_images/user_img`);

            try {
                await deleteObject(imageRef);
                console.log("Previous profile image deleted.");
            } catch (error) {
                console.log("No existing profile image found or error deleting image:", error);
            }

            await uploadBytes(imageRef, file);

            const imageUrl = await getDownloadURL(imageRef);

            const profileRef = databaseRef(db, 'profile/user_image');
            await set(profileRef, imageUrl);

        } catch (error) {
            console.error("Error uploading user image: ", error);
            alert('Failed to upload user image.');
        }
    } else {
        alert("Please select an image to upload.");
    }


    spinner_upload_user_image_btn.classList.add('hidden');
    upload_user_image_btn.querySelector('p').textContent = "Successfully Uploaded .!";
    user_image_input.value = '';
    console.log("Adding green background...");
    upload_user_image_btn.classList.add('bg-green-600'); upload_user_image_btn.classList.remove('bg-blue-600');


    setTimeout(function () {
        upload_user_image_btn.querySelector('p').textContent = "Upload Image";
        upload_user_image_btn.classList.add('bg-blue-600'); upload_user_image_btn.classList.remove('bg-green-600');

    }, 3000);


});







const skeleton_profile_image_preview = document.getElementById('skeleton-profile-image-preview');

const skeleton_user_image_preview = document.getElementById('skeleton-user-image-preview');


onValue(databaseRef(db, 'profile'), (snapshot) => {

    const snapImages = snapshot.val();

    if (snapImages && snapImages.profile_image) {
        preview_profile_image.src = snapImages.profile_image;
        preview_profile_image.classList.remove('hidden');
        skeleton_profile_image_preview.classList.add('hidden');
    } else {
        preview_profile_image.src = 'images/profile-img.png';
        preview_profile_image.classList.remove('hidden');
        skeleton_profile_image_preview.classList.add('hidden');
    }


    if (snapImages && snapImages.user_image) {
        preview_user_image.src = snapImages.user_image;
        preview_user_image.classList.remove('hidden');
        skeleton_user_image_preview.classList.add('hidden');
    } else {
        preview_user_image.src = 'images/user-image.png';
        preview_user_image.classList.remove('hidden');
        skeleton_user_image_preview.classList.add('hidden');
    }


});




