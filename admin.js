import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
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
    Balance: ₦<span id="balance-${doc.id}">${Number(data.balance).toLocaleString()}</span><br><br>

    <input
        type="number"
        id="amount-${doc.id}"
        placeholder="New Balance"
        style="padding:8px;border-radius:8px;width:150px;"
    >

    <button
        class="action-btn updateBalanceBtn"
        data-id="${doc.id}"
    >
        Update Balance
    </button>
</div>
`;

    });

    usersList.innerHTML = html;

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("updateBalanceBtn")) return;

    const userId = e.target.dataset.id;

    const amount = document.getElementById(`amount-${userId}`).value;

    if (amount === "") {
        alert("Enter a balance");
        return;
    }

    try {

        await updateDoc(doc(db, "users", userId), {
            balance: Number(amount)
        });

        document.getElementById(`balance-${userId}`).innerText =
            Number(amount).toLocaleString();

        alert("Balance updated successfully!");

    } catch (error) {

        alert(error.message);

    }

});
