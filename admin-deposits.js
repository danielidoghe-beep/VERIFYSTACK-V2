import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
addDoc,
serverTimestamp
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

    snapshot.forEach((deposit) => {

        const data = deposit.data();

        if (data.status === "Pending") {

            html += `
            <div class="transaction-card" style="margin-bottom:15px">

            <strong>${data.email}</strong><br>

            Amount: ₦${Number(data.amount).toLocaleString()}<br>

            Method: ${data.paymentMethod}<br>

            Status:
            <b>${data.status}</b>

            <br><br>

            <button
            class="action-btn approveBtn"
            data-id="${deposit.id}"
            data-uid="${data.uid}"
            data-amount="${data.amount}"
            >

            Approve

            </button>

            </div>
            `;
        }

    });

    if (html === "") {

        html =
        "<div class='transaction-card'>No Pending Deposits</div>";

    }

    depositRequests.innerHTML = html;

});
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("approveBtn")) return;

    const depositId = e.target.dataset.id;
    const userId = e.target.dataset.uid;
    const amount = Number(e.target.dataset.amount);

    try {

        // Get current user document
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User not found.");
            return;
        }

        const userData = userSnap.data();

        const currentBalance = Number(userData.balance || 0);

        // Update user balance
        await updateDoc(userRef, {
            balance: currentBalance + amount
        });

        // Mark deposit as approved
        const depositRef = doc(db, "deposits", depositId);

        await updateDoc(depositRef, {
            status: "Approved"
        });

        // Save transaction history
        await addDoc(collection(db, "transactions"), {
            uid: userId,
            email: userData.email,
            type: "Deposit",
            amount: amount,
            status: "Approved",
            createdAt: serverTimestamp()
        });

        alert("Deposit Approved Successfully!");

        window.location.reload();

    } catch (error) {

        alert(error.message);

    }

});
