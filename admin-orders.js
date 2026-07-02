import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("ordersContainer");

async function loadOrders() {

    const snapshot = await getDocs(collection(db, "orders"));

    let html = "";

    if (snapshot.empty) {

        html = `
        <div class="transaction-card">
            No orders yet.
        </div>
        `;

    } else {

        snapshot.forEach((doc) => {

            const order = doc.data();

            html += `

            <div class="transaction-card">

                <h3>${order.title}</h3>

                <p><strong>Customer UID:</strong><br>${order.uid}</p>

                <p><strong>Price:</strong> ₦${Number(order.price).toLocaleString()}</p>

                <p><strong>Email Sold:</strong><br>${order.email}</p>

            </div>

            <br>

            `;

        });

    }

    container.innerHTML = html;

}

loadOrders();
