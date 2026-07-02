import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    auth
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const container = document.getElementById("purchaseContainer");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {

    if (!productId) {

        container.innerHTML = `
        <div class="transaction-card">
        Product not found.
        </div>
        `;
        return;

    }

    try {

        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {

            container.innerHTML = `
            <div class="transaction-card">
            Product not found.
            </div>
            `;
            return;

        }

        const product = productSnap.data();

        container.innerHTML = `

        <div class="transaction-card">

            <img
            src="${product.image}"
            style="width:100%;border-radius:10px;margin-bottom:15px;">

            <h2>${product.title}</h2>

            <p>${product.description}</p>

            <h3>₦${Number(product.price).toLocaleString()}</h3>

            <br>

            <button
            id="confirmPurchase"
            class="primary-btn">

            Confirm Purchase

            </button>

        </div>

        `;
const confirmBtn = document.getElementById("confirmPurchase");

confirmBtn.addEventListener("click", () => {
    confirmBtn.disabled = true;
    confirmBtn.innerText = "Processing...";
    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            alert("Please login.");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User not found.");
            return;
        }

        const userData = userSnap.data();

        const balance = Number(userData.balance || 0);

        if (balance < Number(product.price)) {
            alert("Insufficient balance.");
            return;
        }

        // Deduct balance

await updateDoc(userRef, {

    balance: balance - Number(product.price)

});
await updateDoc(productRef, {

    sold: true

});
await addDoc(collection(db, "orders"), {

    uid: user.uid,

    productId: productId,

    title: product.title,

    price: product.price,

    email: product.email,

    password: product.password,

    purchasedAt: serverTimestamp()

});
await addDoc(collection(db, "transactions"), {

    uid: user.uid,

    type: "Purchase",

    title: product.title,

    amount: Number(product.price),

    status: "Completed",

    createdAt: serverTimestamp()

});
        container.innerHTML = `

<div class="transaction-card">

<h2>✅ Purchase Successful</h2>

<p><strong>Product:</strong> ${product.title}</p>

<p><strong>Login Email:</strong><br>${product.email}</p>

<p><strong>Password:</strong><br>${product.password}</p>

</div>

`;
alert("Balance deducted successfully.");

    });

});
    } catch (error) {

        console.log(error);

        container.innerHTML = `
        <div class="transaction-card">
        Error loading product.
        </div>
        `;

    }

}

loadProduct();
