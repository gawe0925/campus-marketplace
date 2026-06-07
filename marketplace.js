import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js"
import { collection, getDocs, addDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAORO77__I2SHOVVB3ByHIi6wIhQQu_7-8",
    authDomain: "comp6750-group37.firebaseapp.com",
    projectId: "comp6750-group37",
    storageBucket: "comp6750-group37.firebasestorage.app",
    messagingSenderId: "104909862405",
    appId: "1:104909862405:web:d7d191fe2f30233a880e6c"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html"
        return
    }

    const uid = user.uid

    const snapshot = await getDocs(collection(db, "items"))

    const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    const listings = products.filter(
        product => product.userId !== uid
    )

    async function render(listings) {
        const container = document.querySelector(".main_container")
        container.innerHTML = listings.map(p => {
            const price = typeof p.price === "string" && p.price.toLowerCase() === "trade" ? "Trade" : `Price: ${p.price}`
            return `
                <div class="item-card" data-id="${p.id}">
                    <div class="item-image-wrapper">
                        <img src="${p.imageUrls?.[0] || 'placeholder.jpg'}" class="item-image">
                        <button class="heart-btn" data-id="${p.id}">♡</button>
                    </div>
                    <div class="item-info">
                        <h5>${p.productName}</h5>
                        <p>${price}</p>
                    </div>
                </div>
            `
        }).join('')

        const shortlistSnap = await getDocs(query(
            collection(db, "shortlist"),
            where("userId", "==", uid)
        ))
        const shortlistedIds = new Set(shortlistSnap.docs.map(d => d.data().itemId))

        // card
        document.querySelectorAll(".item-card").forEach(card => {
            card.addEventListener("click", (e) => {
                if (e.target.classList.contains("heart-btn")) return

                const itemId = card.dataset.id
                const product = products.find(p => p.id === itemId)
                const price = typeof product.price === "string" && product.price.toLowerCase() === "trade" ? "Trade" : `Price: ${product.price}`
                const category = product.category ? product.category[0].toUpperCase() + product.category.slice(1) : ""
                const condition = product.condition ? product.condition[0].toUpperCase() + product.condition.slice(1) : ""

                document.getElementById("modalImage").src = product.imageUrls?.[0] || 'placeholder.jpg'
                document.getElementById("modalName").textContent = product.productName
                document.getElementById("modalPrice").textContent = price
                document.getElementById("modalCategory").textContent = category
                document.getElementById("modalCondi").textContent = condition
                document.getElementById("modalDescription").textContent = product.description
                document.getElementById("modalEmail").textContent = "Seller: " + product.userEmail
                document.getElementById("modalOverlay").classList.add("active")
            })
        })

        // heart
        document.querySelectorAll(".heart-btn").forEach(btn => {
            const itemId = btn.dataset.id

            if (shortlistedIds.has(itemId)) {
                btn.textContent = "♥"
                btn.classList.add("liked")
            }

            btn.addEventListener("click", async () => {
                const q = query(
                    collection(db, "shortlist"),
                    where("userId", "==", uid),
                    where("itemId", "==", itemId)
                )
                const snapshot = await getDocs(q)

                if (snapshot.empty) {
                    await addDoc(collection(db, "shortlist"), {
                        userId: uid,
                        itemId: itemId
                    })
                    btn.textContent = "♥"
                    btn.classList.add("liked")
                    shortlistedIds.add(itemId)
                } else {
                    const docRef = snapshot.docs[0].ref
                    await deleteDoc(docRef)
                    btn.textContent = "♡"
                    btn.classList.remove("liked")
                    shortlistedIds.delete(itemId)
                }
            })
        })
    }
    await render(listings)

    // Category Filter
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"))
            btn.classList.add("active")

            const cateFiltered = btn.dataset.category === "all"
                ? listings
                : listings.filter(p => p.category.toLowerCase() === btn.dataset.category.toLowerCase())

            render(cateFiltered)

        })
    })

})


// background
document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) {
        document.getElementById("modalOverlay").classList.remove("active")
    }
})
// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html"
    })
})