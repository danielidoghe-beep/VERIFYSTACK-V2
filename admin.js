import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const ADMIN_EMAIL = "danielidoghe@gmail.com";

const usersList = document.getElementById("usersList");
const totalUsers = document.getElementById("totalUsers");
const logoutBtn = document.getElementById("logoutBtn");

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

    const querySnapshot = await getDocs(collection(db, "users"));

    totalUsers.innerText = querySnapshot.size;

    let html = "";

    querySnapshot.forEach((doc) => {

        const data = doc.data();

        html += `
        <div class="transaction-card" style="margin-bottom:15px;">
            <strong>${data.fullname}</strong><br>
            ${data.email}<br>
            Balance: ₦${Number(data.balance).toLocaleString()}
        </div>
        `;

    });

    usersList.innerHTML = html;

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
