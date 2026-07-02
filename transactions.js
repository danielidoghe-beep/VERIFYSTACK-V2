import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("transactionsContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const q = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    let html = "";

    if (snapshot.empty) {

        html = `
        <div class="transaction-card">
            No transactions yet.
        </div>
        `;

    } else {

        snapshot.forEach((doc) => {

            const transaction = doc.data();

            const color =
                transaction.type === "Purchase"
                ? "red"
                : "green";

            const sign =
                transaction.type === "Purchase"
                ? "-"
                : "+";

            html += `

            <div class="transaction-card">

                <h3>${transaction.title || transaction.type}</h3>

                <p><strong>Type:</strong> ${transaction.type}</p>

                <p style="color:${color};font-size:20px;">

                    ${sign}₦${Number(transaction.amount).toLocaleString()}

                </p>

                <p>Status: ${transaction.status}</p>

            </div>

            <br>

            `;

        });

    }

    container.innerHTML = html;

});
