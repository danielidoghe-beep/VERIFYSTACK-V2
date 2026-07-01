import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("facebookProducts");

async function loadFacebookAccounts() {

    try {

        const q = query(
            collection(db, "products"),
            where("category", "==", "Facebook"),
            where("sold", "==", false)
        );

        const snapshot = await getDocs(q);

        let html = "";

        if (snapshot.empty) {

            html = `
            <div class="transaction-card">
            No Facebook accounts available.
            </div>
            `;

        } else {

            snapshot.forEach((doc) => {

                const product = doc.data();

                html += `
                <div class="transaction-card">

                <h3>${product.title}</h3>

                <p>${product.description}</p>

                <h2>₦${Number(product.price).toLocaleString()}</h2>

                <button class="primary-btn">

                👁 View Details

                </button>

                </div>

                <br>
                `;

            });

        }

        container.innerHTML = html;

    } catch (error) {

        console.log(error);

    }

}

loadFacebookAccounts();
