import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("ordersContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const q = query(

        collection(db, "orders"),

        where("uid", "==", user.uid),

        orderBy("purchasedAt", "desc")

    );

    const snapshot = await getDocs(q);

    let html = "";

    if (snapshot.empty) {

        html = `
        <div class="transaction-card">

        No purchases yet.

        </div>
        `;

    } else {

        snapshot.forEach((doc) => {

            const order = doc.data();

            html += `

            <div class="transaction-card">

            <h3>${order.title}</h3>

            <p><strong>Price:</strong> ₦${Number(order.price).toLocaleString()}</p>

            <p><strong>Email:</strong><br>${order.email}</p>

            <p><strong>Password:</strong><br>${order.password}</p>

            </div>

            <br>

            `;

        });

    }

    container.innerHTML = html;

});
