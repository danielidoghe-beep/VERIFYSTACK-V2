import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const ADMIN_EMAIL = "danielidoghe@gmail.com";

const depositRequests = document.getElementById("depositRequests");

document.getElementById("backBtn").onclick = () => {
    window.location.href = "admin.html";
};

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.email !== ADMIN_EMAIL) {
        alert("Access Denied!");
        window.location.href = "dashboard.html";
        return;
    }

    const snapshot = await getDocs(collection(db, "deposits"));

    let html = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.status === "Pending") {

            html += `
            <div class="transaction-card" style="margin-bottom:15px;">

                <strong>${data.email}</strong><br>

                Amount: ₦${Number(data.amount).toLocaleString()}<br>

                Method: ${data.paymentMethod}<br>

                Status: <b>${data.status}</b>

            </div>
            `;

        }

    });

    if (html === "") {
        html = "<div class='transaction-card'>No pending deposits.</div>";
    }

    depositRequests.innerHTML = html;

});
