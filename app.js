// ---------------------------------------------------------
// Importing Firebase Tools
// ---------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

import { 
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import { 
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";


// ---------------------------------------------------------
// Firebase Config
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAORO77__I2SHOVVB3ByHIi6wIhQQu_7-8",
  authDomain: "comp6750-group37.firebaseapp.com",
  projectId: "comp6750-group37",
  storageBucket: "comp6750-group37.firebasestorage.app",
  messagingSenderId: "104909862405",
  appId: "1:104909862405:web:d7d191fe2f30233a880e6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth  = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// ---------------------------------------------------------
// LOGIN LOGIC
// ---------------------------------------------------------
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const messageArea = document.getElementById("messageArea");

const userEmail = document.getElementById("userEmail");
const signOutButton = document.getElementById("signOutButton");

if (loginButton) {
    loginButton.addEventListener("click", async function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            messageArea.textContent = "Please enter both email and password.";
            messageArea.className = "mt-3 text-start text-danger";
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";
        messageArea.textContent = "";

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            messageArea.textContent = `Welcome, ${user.email}. Redirecting...`;
            messageArea.className = "mt-3 text-start text-success";

            setTimeout(() => window.location.href = "index.html", 2000);

        } catch (error) {
            messageArea.textContent = "Login failed. Check your credentials.";
            messageArea.className = "mt-3 text-start text-danger";
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });
}


// ---------------------------------------------------------
// AUTH CHECK + SIGN OUT
// ---------------------------------------------------------
if (userEmail || signOutButton) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (userEmail) userEmail.textContent = user.email;
        } else {
            window.location.href = "login.html";
        }
    });
}

if (signOutButton) {
    signOutButton.addEventListener("click", async function () {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            alert("Sign out failed.");
        }
    });
}


// ---------------------------------------------------------
// AUTH HELPER — WAIT FOR USER BEFORE LOADING PAGE
// ---------------------------------------------------------
export function onUserReady(callback) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        callback(user);
    });
}


// ---------------------------------------------------------
// STORAGE UPLOAD
// ---------------------------------------------------------
export async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `listing_images/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload progress:", progress + "%");
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    resolve(url);
                });
            }
        );
    });
}


// ---------------------------------------------------------
// FIRESTORE CRUD
// ---------------------------------------------------------

// Get only this user's listings
export async function getUserListings() {
    const user = auth.currentUser;

    const q = query(
        collection(db, "items"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Create item
export async function createItem(itemData, imageUrls) {
    return await addDoc(collection(db, "items"), {
        ...itemData,
        imageUrls: imageUrls || [],
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
    });
}

// Get item by ID
export async function getItemById(id) {
    const docRef = doc(db, "items", id);
    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
}

// Update item
export async function updateItem(id, data) {
    const docRef = doc(db, "items", id);
    return await updateDoc(docRef, data);
}

// Delete item
export async function deleteItem(id) {
    return await deleteDoc(doc(db, "items", id));
}
export { auth };