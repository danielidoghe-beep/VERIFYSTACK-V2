import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("entertainmentProducts");

async function loadProducts() {

    const q = query(
        collection(db, "products"),
        where("category", "==", "Entertainment"),
        where("sold", "==", false)
    );

    const snapshot = await getDocs(q);

    let html = "";

    if (snapshot.empty) {

        html = `
        <div class="transaction-card">
            No entertainment products available.
        </div>
        `;

    } else {

        snapshot.forEach((doc) => {

            const product = doc.data();

            html += `

            <div class="transaction-card">

                <img src="${product.image}"
                style="width:100%;border-radius:10px;margin-bottom:10px;">

                <h3>${product.title}</h3>

                <p>${product.description}</p>

                <h2>₦${Number(product.price).toLocaleString()}</h2>

                <button class="primary-btn"
                onclick="window.location.href='purchase.html?id=${doc.id}'">

                🛒 Buy Now

                </button>

            </div>

            <br>

            `;

        });

    }

    container.innerHTML = html;

}

loadProducts();
