// ---------------------------------------------------------
// shortlist.js — 完全獨立，不依賴任何其他 js 檔案
// ---------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ---------------------------------------------------------
// Firebase Init
// ---------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAORO77__I2SHOVVB3ByHIi6wIhQQu_7-8",
    authDomain: "comp6750-group37.firebaseapp.com",
    projectId: "comp6750-group37",
    storageBucket: "comp6750-group37.firebasestorage.app",
    messagingSenderId: "104909862405",
    appId: "1:104909862405:web:d7d191fe2f30233a880e6c"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ---------------------------------------------------------
// DOM References
// ---------------------------------------------------------
const userEmailEl    = document.getElementById("userEmail");
const container      = document.getElementById("shortlistContainer");
const emptyState     = document.getElementById("emptyState");
const firebaseNotice = document.getElementById("firebaseNotice");
const signOutButton  = document.getElementById("signOutButton");

// ---------------------------------------------------------
// Sign Out
// ---------------------------------------------------------
signOutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Sign out error:", error);
        alert("Sign out failed. Please try again.");
    }
});

// ---------------------------------------------------------
// Auth Guard
// ---------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    userEmailEl.textContent = user.email;
    await loadShortlist(user);
});

// ---------------------------------------------------------
// DB — 抓 shortlist + join items
// ---------------------------------------------------------
async function getShortlistedItems(user) {
    // Step 1: 抓這個 user 的所有 shortlist 紀錄
    const shortlistQuery = query(
        collection(db, "shortlist"),
        where("userId", "==", user.uid)
    );
    const shortlistSnap = await getDocs(shortlistQuery);

    if (shortlistSnap.empty) return [];

    // Step 2: 用每筆 shortlist 的 itemId 去 items collection 抓商品資料
    const itemPromises = shortlistSnap.docs.map(async (shortlistDoc) => {
        const itemId = shortlistDoc.data().itemId;
        if (!itemId) return null;

        const itemSnap = await getDoc(doc(db, "items", itemId));
        if (!itemSnap.exists()) return null;

        return {
            shortlistId: shortlistDoc.id,   // 用來刪除 shortlist 那筆
            itemId: itemSnap.id,
            ...itemSnap.data()
        };
    });

    const results = await Promise.all(itemPromises);
    return results.filter(Boolean);    // 過濾掉已刪除的商品
}

async function removeFromShortlist(shortlistId) {
    await deleteDoc(doc(db, "shortlist", shortlistId));
}

// ---------------------------------------------------------
// Load & Render
// ---------------------------------------------------------
async function loadShortlist(user) {
    try {
        const items = await getShortlistedItems(user);

        if (items.length === 0) {
            showEmptyState();
            return;
        }

        container.innerHTML = "";
        emptyState.style.display = "none";
        items.forEach(renderSingleItem);

    } catch (error) {
        console.error("Error loading shortlist:", error);
        firebaseNotice.style.display = "block";
    }
}

function renderSingleItem(item) {
    const firstImage   = item.imageUrls?.[0] || "placeholder.jpg";
    const isTradePrice = item.price === "Trade";
    const priceDisplay = isTradePrice ? "Trade" : `$${item.price}`;

    const div = document.createElement("div");
    div.className = "shortlist-item";
    div.innerHTML = `
        <img src="${firstImage}" alt="${item.productName}">
        <div class="item-details">
            <div class="item-category">${item.category || "Uncategorized"}</div>
            <h4>${item.productName}</h4>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Condition:</strong> ${item.condition}</p>
            <p><strong>Seller:</strong> ${item.sellerEmail}</p>
            <p class="item-price ${isTradePrice ? "trade" : ""}">${priceDisplay}</p>
            <button class="remove-btn">Remove from Shortlist</button>
        </div>
    `;

    div.querySelector(".remove-btn").addEventListener("click", () => {
        handleRemove(item.shortlistId, div);
    });

    container.appendChild(div);
}

// ---------------------------------------------------------
// Remove
// ---------------------------------------------------------
async function handleRemove(shortlistId, itemEl) {
    if (!confirm("Are you sure you want to remove this item from your shortlist?")) return;

    const btn = itemEl.querySelector(".remove-btn");

    try {
        btn.disabled = true;
        btn.textContent = "Removing...";

        await removeFromShortlist(shortlistId);

        itemEl.remove();

        if (container.children.length === 0) {
            showEmptyState();
        }
    } catch (error) {
        console.error("Error removing from shortlist:", error);
        btn.disabled = false;
        btn.textContent = "Remove from Shortlist";
        alert("Failed to remove item. Please try again.");
    }
}

// ---------------------------------------------------------
// Empty State
// ---------------------------------------------------------
function showEmptyState() {
    container.innerHTML = "";
    emptyState.style.display = "block";
}